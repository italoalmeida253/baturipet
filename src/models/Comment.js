const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'docModel'
  },
  docModel: {
    type: String,
    required: true,
    enum: ['Client', 'Enterprise']
  },
  comment: {
    type: String,
    required: true
  }
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
