import Axios from 'axios'
import router from '@/router'

const CastingComplexAPI = `http://${window.location.hostname}:5050`

export default {
  user: { authenticated: false },

  authenticate (context, credentials, redirect) {
    Axios.post(`${CastingComplexAPI}/api/v1/login`, credentials)
      .then(({data: {token}}) => {
        context.$cookie.set('token', token, '1D')
        context.validLogin = true
        this.user.authenticated = true

        if (redirect) router.push(redirect)
      }).catch(({response: {data}}) => {
        context.snackbar = true
        context.message = data.message
      })
  },
  getCities (context, credentials, redirect) {
    Axios.get(`${CastingComplexAPI}/extras/cities/28`)
      .then((data) => {
        context.cities = data
      }).catch((err) => {
        console.log(err)
      })
  }
}
