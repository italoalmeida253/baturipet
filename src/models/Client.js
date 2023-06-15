require('@models/Publication')
const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  /*
  phone: {
    type: Number,
    required: true
  },
  */
  cpf: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  publications: [{
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  }],
  likes: [],
  profilePic: {
    type: 'String',
    default: '/images/person-circle.svg'
  }
})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client
