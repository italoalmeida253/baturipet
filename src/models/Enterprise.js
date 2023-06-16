const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

async function main () {
  console.log(await bcrypt.hash('qazoknip000', 10))
}
main()

const enterpriseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  instagram: {
    type: String
  },
  whatsapp: {
    type: String
  },
  phone: {
    type: Number,
    required: true
  },
  cnpj: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  likes: [],
  profilePic: {
    type: 'String',
    default: '/images/person-circle.svg'
  }
})

const Enterprise = mongoose.model('Enterprise', enterpriseSchema)

module.exports = Enterprise
