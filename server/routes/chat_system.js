var models  = require('../models');
var _ = require('lodash')

async function addMessageToDatabase (data) {
  // Add message to database either way
  var fromUser = await models.User.findOne({where: {username: data.from}})
  var toUser = await models.User.findOne({where: {username: data.to}})
  var chatMessageInstance = {
    fromId: fromUser.id,
    toId: toUser.id,
    message: data.message,
    read: false
  }
  await models.ChatMessage.create(chatMessageInstance)
}

async function loadChatPreviews (username) {

  var user = await models.User.findOne({where: { username: username }})

  var fromUserUsername = user.username

  // Find all messages that username is part of
  var messageParticipants = await models.ChatMessage.findAll({
    where: { $or: [{fromId: user.id}, {toId: user.id}] },
    attributes: ['fromId', 'toId']
  })

  var messageParticipantsJson = messageParticipants.map(m => m.toJSON())
  
  // Awful magic trick
  var conversations = []
  for (var m of messageParticipantsJson) {
    var a = [m.fromId, m.toId]
    conversations.push(JSON.stringify(a.sort()))
  }

  var uniqueConversationsStrings = _.uniq(conversations)
  var uniqueConversations = []

  uniqueConversationsStrings.map(u => uniqueConversations.push(JSON.parse(u)))

  messageParticipantsJson = []
  for (var conversation of uniqueConversations) {
    var conversationJson = {fromId: conversation[0], toId: conversation[1]}
    messageParticipantsJson.push(conversationJson)
  }
  console.log(uniqueConversations)
  // End of awful magic trick

  chatPreviews = []

  for (conversationMembers of uniqueConversations) {
    var otherUserId = _.difference(conversationMembers, [user.id])[0]

    chatPreview = {}
    var userInstance = await models.User.findById(otherUserId)
    var userObj = await userInstance.buildResponse()
    chatPreview.avatar = userObj.avatar
    chatPreview.username = userObj.username

    var mostRecentMessage = await models.ChatMessage.findAll({
      limit:1,
      attributes: ['fromId', 'message', 'read'],
      order: [ [ 'createdAt', 'DESC' ]],
      where: {$and: [
        { fromId: { $in: [user.id, otherUserId] } },
        { toId: { $in: [user.id, otherUserId] } }
      ]}
    })
    chatPreview.lastMessage = mostRecentMessage[0].toJSON().message

    if (mostRecentMessage[0].fromId === user.id) {
      chatPreview.unreadMessage = false
    } else {
      chatPreview.unreadMessage = mostRecentMessage[0].toJSON().read ? false : true
    }
    chatPreviews.push(chatPreview)
  }

  return chatPreviews
}

async function loadChatWithUser (data) {
  var fromUser = await models.User.findOne({where: {username: data.fromUser}})
  var toUser = await models.User.findOne({where: {username: data.toUser}})
  var userAvatar = await toUser.buildResponse()

  var toUserProfileLink = {}
  toUserProfileLink.params = {}
  toUserProfileLink.params.username = toUser.username
  if (toUser.roleId === 1) {
    toUserProfileLink.name = "Actor profile"
  } else if (toUser.roleId === 2) {
    toUserProfileLink.name = "Casting director profile"
  } else if (toUser.roleId === 3 ) {
    toUserProfileLink.name = "Agent profile"
  }

  var messages = await models.ChatMessage.findAll({
    where: {$and: [
      { fromId: { $in: [fromUser.id, toUser.id] } },
      { toId: { $in: [fromUser.id, toUser.id] } }
    ]},
    order: [
      ['id', 'ASC']
  ],
  })

  messages.map(async function (m) { 
    if (m.toId === fromUser.id) {
      await m.update({ read: true } ) 
    }
  })

  var messagesJson = messages.map(m => m.toJSON())
  
  for (var message of messagesJson) {
    message.from = message.fromId === fromUser.id ? fromUser.username : toUser.username

    message.to = message.toId === toUser.id ? toUser.username : fromUser.username
    message.toUserProfileLink = toUserProfileLink
    message.toUserAvatar = userAvatar.avatar
  }

  return messagesJson
}

async function getNumberOfUnreadMessages(userId) {
  var unreadMessages = await models.ChatMessage.findAndCountAll({
    where: {$and: [{toId: userId}, {read: false}]}
  })
  return unreadMessages.count
}

exports = module.exports = function (io) {
  
  connectedUsers = {}

  io.on('connection', function(socket) {

    socket.on('logged_on', async data => {
      connectedUsers[data.username] = socket
      var numberOfUnreadMessages = await getNumberOfUnreadMessages(data.userId)
      socket.emit('unread_messages', numberOfUnreadMessages)
    })

    socket.on('open_chat', async data => {
      connectedUsers[data.username] = socket
      console.log("Connected users:: " + Object.keys(connectedUsers))
      var chats = await loadChatPreviews(data.username)
      socket.emit('chat_previews', chats)
    })

    socket.on('refresh_preview', async data => {
      var chats = await loadChatPreviews(data.username)
      socket.emit('chat_previews', chats)
    })

    socket.on('open_chat_with_user', async data => {
      var messages = await loadChatWithUser(data)
      socket.emit('load_chat', messages)

      if (connectedUsers[data.toUser]) {
        data2 = {reader: data.fromUser, from: data.toUser}
        connectedUsers[data.toUser].emit('message_read', data2)
      }
      
      // update header message count
      models.User.findOne({where: {username: data.fromUser}}).then(async user => {
        var unreadMessages = await getNumberOfUnreadMessages(user.id)
        connectedUsers[data.fromUser + '-header'].emit('unread_messages', unreadMessages)
      })
    })
  
    socket.on('send_message', async data => {
      console.log(JSON.stringify(data))
      // Emit new message to the sender, this socket IS the sender
      socket.emit('new_message', data)
  
      // If target user is connected, send it
      console.log(Object.keys(connectedUsers))
      for (var user of Object.keys(connectedUsers)) {
        if (user === data.to) {
          connectedUsers[user].emit('new_message', data)
        }
        if (user === data.to + '-header') {
          connectedUsers[user].emit('new_message')
        }
      }
      // Asynchronously send message to database
      addMessageToDatabase(data)
    })

    socket.on('read_latest_message_from', async data => {
      connectedUsers[data.from].emit('message_read', data)

      // Update in the database
      var fromUser = await models.User.findOne({where: {username: data.from}})
      var readerUser = await models.User.findOne({where: {username: data.reader}})

      var messages = await models.ChatMessage.findAll({
        limit: 20,
        where: {$and: [
          { fromId: { $in: [fromUser.id] } },
          { toId: { $in: [readerUser.id] } }
        ]},
        order: [
          ['id', 'DESC']
      ],
      })
  
      messages.map(async function (m) { 
          await m.update({ read: true } )
      })
    })
  });
}