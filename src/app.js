require('module-alias/register')
require('dotenv').config()
const https = require('https')
const fs = require('fs')
const express = require('express')
const path = require('path')
const connectDb = require('@configs/database')
const session = require('express-session')
const routes = require('@routes/index')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()

const httpsServer = https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app)

app.set('view engine', 'ejs')
app.set('views', path.resolve('src', 'views'))

app.use(express.static(path.resolve('public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
app.use(session({
  secret: process.env.COOKIE_SECRET_KEY,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: true
  },
  saveUninitialized: true,
  resave: true
}))
app.use(flash())
app.use(routes);

(async () => {
  await connectDb()
  httpsServer.listen(9687, () => {
    console.log('servidor rodando na url https://localhost:9687/')
  })
})()
