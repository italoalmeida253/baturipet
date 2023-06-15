const express = require('express')
const controller = require('@controllers/users')
const upload = require('@configs/multer')

const routes = new express.Router()

routes
  .route('/user/logout')
  .get(controller.logout.get)
  .post(controller.logout.post)
routes
  .route('/user/edit-data')
  .get(controller.editData.get)
  .post(upload.single('image'), controller.editData.post)
routes
  .route('/user/like')
  .post(controller.like.post)
routes
  .route('/user/comment')
  .post(controller.comment.post)
routes.get('/password-recovery', controller.passwdRecovery.get)
module.exports = routes
