import Axios from 'axios'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export function isLoggedIn () {
  // TODO: add expiry date check
  var token = localStorage.getItem('session_token')

  if (token !== null) {
    return true
  }

  return false
}

export function isRegistrationInProgress () {
  var registrationInProgress = localStorage.getItem('registration_in_progress')
  if (registrationInProgress === null) {
    return false
  }
  return true
}

export function login (credentials) {
  return Axios.post(`${CastingComplexAPI}/login`, credentials).then(function (response) {
    console.log(response.data)
    localStorage.setItem('session_token', response.data.session_token)
    localStorage.setItem('logged_profile', JSON.stringify(response.data.profile))
    localStorage.removeItem('registration_in_progress')
    return true
  })
    .catch(function (error) {
      console.log(error)
      return false
    })
}

export function logout () {
  localStorage.removeItem('session_token')
  localStorage.removeItem('logged_profile')
  localStorage.removeItem('registration_in_progress')
}

export function isActor () {
  var roleId = JSON.parse(localStorage.getItem('logged_profile')).user.roleId

  if (roleId === 1) {
    return true
  }
  return false
}

export function isDirector () {
  var roleId = JSON.parse(localStorage.getItem('logged_profile')).user.roleId

  if (roleId === 2) {
    return true
  }
  return false
}

export function isAgent () {
  var roleId = JSON.parse(localStorage.getItem('logged_profile')).user.roleId
  console.log(roleId)
  if (roleId === 3) {
    return true
  }
  return false
}
