const express = require('express')
const controller = require('@controllers/public')

const routes = new express.Router()

function checkSession (req, res, next) {
  try {
    const { user } = req.session
    if (user) {
      const { type } = user
      return res.redirect(`/${type}/profile`)
    }
  } catch {
    return next()
  }
  return next()
}

routes.get('/', controller.feed.get)
routes.route('/register')
  .get(controller.register.get)
  .post(controller.register.post)
routes.route('/login')
  .get(checkSession, controller.login.get)
  .post(controller.login.post)
routes.get('/profile/:username', controller.profile.get)
routes.get('/enterprises', controller.enterprises.get)
module.exports = routes
