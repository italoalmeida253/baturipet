const Enterprise = require('@models/Enterprise')
const Client = require('@models/Client')
const Tokens = require('csrf')
const tokens = new Tokens()

const controller = {
  profile: {
    async get (req, res) {
      const { name, username, profilePic } = req.session.user

      return res.render('enterprises/profile', {
        name,
        username,
        profilePic
      })
    }
  },
  editMedias: {
    get (req, res) {
      const { secret } = req.session.user
      const token = tokens.create(secret)
      return res.render('enterprises/edit-medias', { token })
    },
    async post (req, res) {
      const { whatsapp, instagram, phone, email, location, csrfToken } = req.body
      const { secret, id } = req.session.user

      const validToken = tokens.verify(secret, csrfToken)
      if (!validToken) {
        return res.redirect('/login')
      }

      const enterprise = await Enterprise.findById(id).exec()

      if (location) {
        const [longitude, latitude] = location.split(';')
        enterprise.longitude = longitude
        enterprise.latitude = latitude
      }

      if (whatsapp) {
        enterprise.whatsapp = whatsapp
      }

      if (instagram) {
        enterprise.instagram = instagram
      }

      if (email) {
        let exist = await Enterprise.findOne({ email }).exec()
        if (exist) {
          const sameUser = enterprise.email === exist.email
          if (!sameUser) {
            return res.redirect('back')
          }
        }
        exist = await Client.findOne({ email }).exec()
        if (exist) {
          return res.redirect('back')
        }
        enterprise.email = email
        req.session.user.email = email
      }

      if (phone) {
        let exist = await Enterprise.findOne({ phone }).exec()
        if (exist) {
          const sameUser = enterprise.phone === exist.phone
          if (!sameUser) {
            return res.redirect('back')
          }
        }
        exist = await Client.findOne({ phone }).exec()
        if (exist) {
          return res.redirect('back')
        }
        enterprise.phone = phone
      }

      Promise.all([enterprise.save(), req.session.save()])
      return res.redirect('/enterprise/profile')
    }
  }
}

module.exports = controller
