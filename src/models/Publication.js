require('@models/Comment')
const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const publicationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Client'
  },
  likes: {
    type: Number
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  longitude: {
    type: String
  },
  latitude: {
    type: String
  }
})

const Publication = mongoose.model('Publication', publicationSchema)

module.exports = Publication
