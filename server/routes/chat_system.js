var models  = require('../models');
var _ = require('lodash')

async function addMessageToDatabase (data) {
  // Add message to database either way
  var fromUser = await models.User.findOne({where: {username: data.from}})
  var toUser = await models.User.findOne({where: {username: data.to}})
  var chatMessageInstance = {
    fromId: fromUser.id,
    toId: toUser.id,
    message: data.message
  }
  await models.ChatMessage.create(chatMessageInstance)
}

async function loadChatPreviews (username) {

  var user = await models.User.findOne({where: { username: username }})

  var fromUserUsername = user.username

  var messageParticipants = await models.ChatMessage.findAll({
    where: { $or: [{fromId: user.id}, {toId: user.id}] },
    attributes: ['fromId', 'toId']
  })

  var messageParticipantsJson = messageParticipants.map(m => m.toJSON())
  messageParticipantsJson = _.uniqBy(messageParticipantsJson, 'toId')

  console.log(messageParticipantsJson)

  chatPreviews = []
  for (message of messageParticipantsJson) {
    if (message.toId !== user.id) {
      chatPreview = {}
      var userInstance = await models.User.findById(message.toId)
      var userObj = await userInstance.buildResponse()
      chatPreview.avatar = userObj.avatar
      chatPreview.username = userObj.username

      var mostRecentMessage = await models.ChatMessage.findAll({
        limit:1,
        attributes: ['message'],
        order: [ [ 'createdAt', 'DESC' ]],
        where: {$and: [
          { fromId: { $in: [user.id, message.toId] } },
          { toId: { $in: [user.id, message.toId] } }
        ]}
      })

      chatPreview.lastMessage = mostRecentMessage[0].toJSON().message
      chatPreviews.push(chatPreview)
    } else {
      // This case it's when another user send a message to this user for the first time
      chatPreview = {}
      var userInstance = await models.User.findById(message.fromId)
      var userObj = await userInstance.buildResponse()
      chatPreview.avatar = userObj.avatar
      chatPreview.username = userObj.username

      var mostRecentMessage = await models.ChatMessage.findAll({
        limit:1,
        attributes: ['message'],
        order: [ [ 'createdAt', 'DESC' ]],
        where: {$and: [
          { fromId: { $in: [message.fromId] } },
          { toId: { $in: [message.toId] } }
        ]}
      })
      chatPreview.lastMessage = mostRecentMessage[0].toJSON().message
      chatPreviews.push(chatPreview)
    }
  }

  return chatPreviews
}

async function loadChatWithUser (data) {
  var fromUser = await models.User.findOne({where: {username: data.fromUser}})
  var toUser = await models.User.findOne({where: {username: data.toUser}})

  var messages = await models.ChatMessage.findAll({
    where: {$and: [
      { fromId: { $in: [fromUser.id, toUser.id] } },
      { toId: { $in: [fromUser.id, toUser.id] } }
    ]}
  })

  var messagesJson = messages.map(m => m.toJSON())
  for (var message of messagesJson) {
    message.from = message.fromId === fromUser.id ? fromUser.username : toUser.username

    message.to = message.toId === toUser.id ? toUser.username : fromUser.username
  }
  return messagesJson
}

exports = module.exports = function (io) {
  
  connectedUsers = {}

  io.on('connection', function(socket) {

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
    })
  
    socket.on('send_message', async data => {
      console.log(JSON.stringify(data))
      // Emit new message to the sender, this socket IS the sender
      socket.emit('new_message', data)
  
      // If target user is connected, send it
      for (var user of Object.keys(connectedUsers)) {
        if (user === data.to) {
          connectedUsers[user].emit('new_message', data)
        }
      }
      // Asynchronously send message to database
      addMessageToDatabase(data)
    })
  });
}