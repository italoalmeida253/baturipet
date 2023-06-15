const mongoose = require('mongoose')

async function connectDb () {
  await mongoose.connect(process.env.DB_CONNECTION_URL)
  console.log('banco de dados conectado!')
}

module.exports = connectDb
