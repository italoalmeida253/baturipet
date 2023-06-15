const Client = require('@models/Client')
const Enterprise = require('@models/Enterprise')
const bcrypt = require('bcrypt')

async function findUser (email) {
  const client = await Client.findOne({ email }).exec()
  if (!client) {
    const enterprise = await Enterprise.findOne({ email }).exec()
    if (!enterprise) {
      return false
    }
    return {
      ...enterprise._doc,
      type: 'enterprise'
    }
  }
  return {
    ...client._doc,
    type: 'client'
  }
}
async function authUser (email, password) {
  const user = await findUser(email)

  if (!user) {
    return {
      error: 'Usuário não encontrado!'
    }
  }

  const matchPassword = await bcrypt.compare(password, user.password)
  if (!matchPassword) {
    return {
      error: 'Senha incorreta!'
    }
  }

  return user
}

module.exports = authUser
