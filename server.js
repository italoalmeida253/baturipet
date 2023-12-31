require('module-alias/register')
require('dotenv').config()
const express = require('express')
const path = require('path')
const connectDb = require('@configs/database')
const session = require('express-session')
const routes = require('@routes/index')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve('src', 'views'))

app.use(express.static(path.resolve('public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
app.use(session({
  secret: process.env.COOKIE_SECRET_KEY,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  saveUninitialized: true,
  resave: true,
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONNECTION_URL,
    collectionName: 'sessions'
  })
}))
app.use(flash())
app.use(routes);

(async () => {
  await connectDb()
  app.listen(process.env.PORT || 3001, () => {
    console.log(`server is running in http://localhost:${process.env.PORT || 3001}`)
  })
})()
