const mongoose = require('mongoose')

async function connectDb () {
  await mongoose.connect(process.env.DB_CONNECTION_URL)
  console.log('database connected!')
}

module.exports = connectDb
