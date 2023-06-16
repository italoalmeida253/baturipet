const express = require('express')

const routes = new express.Router()

// routes imports
const publicRoutes = require('@routes/public')
const usersRoutes = require('@routes/users')
const clientsRoutes = require('@routes/clients')
const enterprisesRoutes = require('@routes/enterprises')

function defineTypeVar (req, res, next) {
  try {
    const { type } = req.session.user
    res.locals.type = type
  } catch {
    res.locals.type = 'client'
  } finally {
    next()
  }
}

function checkSession (req, res, next) {
  try {
    console.log(req.session)
    const { user } = req.session
    if (user) {
      return next()
    }
  } catch {
    console.log('check session')
    return res.redirect('/login')
  }
  console.log('check session')
  return res.redirect('/login')
}

function checkClient (req, res, next) {
  try {
    const { type } = req.session.user
    if (type === 'client') {
      return next()
    }
    console.log('check client')
    return res.redirect('/')
  } catch {
    console.log('check client')
    return res.redirect('/')
  }
}

function checkEnterprise (req, res, next) {
  try {
    const { type } = req.session.user
    if (type === 'enterprise') {
      return next()
    }
    return res.redirect('/')
  } catch {
    return res.redirect('/')
  }
}

routes.use('/user', checkSession)
routes.use('/client', checkSession, checkClient)
routes.use('/enterprise', checkSession, checkEnterprise)
routes.use(defineTypeVar)
routes.use(publicRoutes)
routes.use(clientsRoutes)
routes.use(enterprisesRoutes)
routes.use(usersRoutes)

module.exports = routes
