const express = require('express')
const controller = require('@controllers/clients')
const upload = require('@configs/multer')

const routes = new express.Router()

routes
  .route('/client/profile')
  .get(controller.profile.get)
routes
  .route('/client/publish')
  .get(controller.publish.get)
  .post(upload.single('image'), controller.publish.post)
routes.get('/client/inbox', controller.inbox.get)

module.exports = routes
