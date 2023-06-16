const Client = require('@models/Client')
const Enterprise = require('@models/Enterprise')
const Publication = require('@models/Publication')
const Comment = require('@models/Comment')
const bcrypt = require('bcrypt')
const Tokens = require('csrf')
const tokens = new Tokens()

const controller = {
  logout: {
    get (req, res) {
      const { secret } = req.session.user
      const token = tokens.create(secret)
      return res.render('logout', { token })
    },
    post (req, res) {
      const { csrfToken } = req.body
      const { secret } = req.session.user
      const validToken = tokens.verify(secret, csrfToken)
      if (!validToken) {
        return res.redirect('/login')
      }
      req.session.destroy()
      return res.redirect('/')
    }
  },
  editData: {
    get (req, res) {
      const { secret } = req.session.user
      const token = tokens.create(secret)
      return res.render('edit-data', { token })
    },
    async post (req, res) {
      const {
        username, email, phone, password, passwordCheck, csrfToken
      } = req.body
      const { id, type, secret } = req.session.user

      const validToken = tokens.verify(secret, csrfToken)
      if (!validToken) {
        return res.redirect('/login')
      }

      let UserType
      let OtherType

      if (type === 'client') {
        UserType = Client
        OtherType = Enterprise
      } else {
        UserType = Enterprise
        OtherType = Client
      }

      const user = await UserType.findById(id).exec()

      if (req.file) {
        const { filename } = req.file
        user.profilePic = `/uploads/${filename}`
      }

      if (username) {
        let exist = await UserType.findOne({ username }).exec()
        if (exist) {
          const sameUser = user.username === exist.username
          if (!sameUser) {
            return res.redirect('back')
          }
        }
        exist = await OtherType.findOne({ username }).exec()
        if (exist) {
          return res.redirect('back')
        }
        user.username = username
        req.session.user.username = username
      }

      if (email) {
        let exist = await UserType.findOne({ email }).exec()
        if (exist) {
          const sameUser = user.email === exist.email
          if (!sameUser) {
            return res.redirect('back')
          }
        }
        exist = await OtherType.findOne({ email }).exec()
        if (exist) {
          return res.redirect('back')
        }
        user.email = email
        req.session.user.email = email
      }

      if (phone) {
        let exist = await UserType.findOne({ phone }).exec()
        if (exist) {
          const sameUser = user.phone === exist.phone
          if (!sameUser) {
            return res.redirect('back')
          }
        }
        exist = await OtherType.findOne({ phone }).exec()
        if (exist) {
          return res.redirect('back')
        }
        user.phone = phone
      }

      if (password) {
        const matchPassword = password === passwordCheck
        if (!matchPassword) {
          return res.redirect('back')
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
      }

      Promise.all([user.save(), req.session.save()])
      return res.redirect(`/${type}/profile`)
    }
  },
  like: {
    async post (req, res) {
      const session = req.session.user
      const { username, type } = session
      const { id } = req.body

      let UserType

      if (type === 'client') {
        UserType = Client
      } else {
        UserType = Enterprise
      }

      const user = await UserType.findOne({ username }).exec()
      console.log(user)
      const publication = await Publication.findById(id).exec()

      const itsLike = user.likes.indexOf(id)

      if (itsLike > -1) {
        user.likes.splice(itsLike, 1)
        session.likes.splice(itsLike, 1)
        publication.likes -= 1
      } else {
        user.likes.push(id)
        session.likes.push(id)
        publication.likes += 1
      }

      Promise.all([user.save(), publication.save(), req.session.save()])

      res.send('liked')
    }
  },
  comment: {
    async post (req, res) {
      const { comment, id } = req.body
      const { id: userId, type } = req.session.user

      const publication = await Publication.findById(id).exec()

      let docModel = null

      if (type === 'client') {
        docModel = 'Client'
      } else {
        docModel = 'Enterprise'
      }

      const newComment = new Comment({
        author: userId,
        docModel,
        comment
      })
      publication.comments.push(newComment.id)

      Promise.all([newComment.save(), publication.save()])

      return res.send('commented')
    }
  },
  passwdRecovery: {
    get (req, res) {
      return res.render('passwd-recovery')
    }
  },
  notifications: {
    get (req, res) {
      return res.render('notifications')
    }
  }
}

module.exports = controller
