const express = require('express')
const controller = require('@controllers/enterprises')

const routes = new express.Router()

routes.get('/enterprise/profile', controller.profile.get)
routes
  .route('/enterprise/edit-medias')
  .get(controller.editMedias.get)
  .post(controller.editMedias.post)

module.exports = routes
