const Client = require('@models/Client')
const Enterprise = require('@models/Enterprise')
const Publication = require('@models/Publication')
const bcrypt = require('bcrypt')
const auth = require('@configs/auth')
const Tokens = require('csrf')
const { cpf: cpfTool, cnpj: cnpjTool } = require('cpf-cnpj-validator')

function filterPublications (posts, userLikes) {
  const publications = [...posts]
  const likes = [...userLikes]
  const relativePublications = []

  for (const publication of publications) {
    const index = likes.indexOf(publication.id)
    const liked = index > -1
    if (liked) {
      publication.state = 'liked'
      relativePublications.push(publication)
    } else {
      publication.state = 'unliked'
      relativePublications.push(publication)
    }
  }

  return relativePublications
}

const controller = {
  feed: {
    async get (req, res) {
      const publications = await Publication.find()
        .populate(['author', {
          path: 'comments',
          populate: {
            path: 'author'
          }
        }]).exec()
      const user = req.session.user
      if (user) {
        const { likes } = req.session.user
        const relativePublications = filterPublications(publications, likes)
        return res.render('feed', {
          publications: relativePublications,
          sessionStatus: 'authenticated'
        })
      } else {
        const relativePublications = filterPublications(publications, [])
        return res.render('feed', {
          type: 'client',
          publications: relativePublications,
          sessionStatus: 'unauthenticated'
        })
      }
    }
  },
  register: {
    get (req, res) {
      res.render('register', { errors: req.flash('error') })
    },
    async post (req, res) {
      const data = { ...req.body }
      let UserType
      let docCode
      let usedDoc
      let docType
      let validDoc

      if (data.cpf) {
        UserType = Client
        docCode = cpfTool.format(data.cpf)
        usedDoc = await Client.findOne({ cpf: docCode }).exec()
        validDoc = cpfTool.isValid(docCode)
        docType = 'cpf'
      }
      if (data.cnpj) {
        UserType = Enterprise
        docCode = cnpjTool.format(data.cnpj)
        usedDoc = await Enterprise.findOne({ cnpj: docCode }).exec()
        validDoc = cnpjTool.isValid(docCode)
        docType = 'cnpj'
      }

      // document check
      if (usedDoc) {
        req.flash('error', 'CPF já utilizado!')
        return res.redirect('back')
      }
      if (!validDoc) {
        req.flash('error', 'CPF inválido!')
        return res.redirect('back')
      }
      //

      const {
        username, email, password, passwordCheck
      } = req.body

      // username check
      let usedUsername = await Client.findOne({ username }).exec()
      if (usedUsername) {
        req.flash('error', 'Nome de usuário já utilizado!')
        return res.redirect('back')
      }
      usedUsername = await Enterprise.findOne({ username }).exec()
      if (usedUsername) {
        req.flash('error', 'Nome de usuário já utilizado!')
        return res.redirect('back')
      }
      //

      // email check
      let usedEmail = await Client.findOne({ email }).exec()
      if (usedEmail) {
        req.flash('error', 'Email já utilizado!')
        return res.redirect('back')
      }
      usedEmail = await Enterprise.findOne({ email }).exec()
      if (usedEmail) {
        req.flash('error', 'Email já utilizado!')
        return res.redirect('back')
      }
      //

      /* phone check
      let usedPhone = await Client.findOne({ phone }).exec()
      if (usedPhone) {
        return res.redirect('back')
      }
      usedPhone = await Enterprise.findOne({ phone }).exec()
      if (usedPhone) {
        return res.redirect('back')
      }
      */

      // password check
      const matchPassword = password === passwordCheck
      if (!matchPassword) {
        req.flash('error', 'As senhas não conferem!')
        return res.redirect('back')
      }
      //

      const user = new UserType({ ...req.body })
      user[docType] = docCode

      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword

      await user.save()
      return res.redirect('/')
    }
  },
  login: {
    get (req, res) {
      res.render('login', { errors: req.flash('error') })
    },
    async post (req, res) {
      const { email, password } = req.body
      const user = await auth(email, password)

      if (user.error) {
        req.flash('error', user.error)
        return res.redirect('/login')
      }

      const { _id: id, username, name, type, likes, profilePic } = user
      const tokens = new Tokens()
      const secret = tokens.secretSync()

      req.session.user = {
        id,
        secret,
        username,
        name,
        type,
        likes,
        profilePic
      }
      return res.redirect(`/${type}/profile`)
    }
  },
  profile: {
    async get (req, res) {
      const { username } = req.params
      const client = await Client.findOne({ username }).populate('publications').exec()
      if (!client) {
        const enterprise = await Enterprise.findOne({ username }).exec()
        if (!enterprise) {
          return res.redirect(303, '/')
        }
        const { name, profilePic, whatsapp, instagram, phone, email, location } = enterprise
        return res.render('enterprise-profile', {
          name,
          username,
          profilePic,
          whatsapp,
          instagram,
          phone,
          email,
          location
        })
      }

      const { name, publications, profilePic } = client
      return res.render('client-profile', {
        name,
        username,
        profilePic,
        publications
      })
    }
  },
  enterprises: {
    async get (req, res) {
      const enterprises = await Enterprise.find().exec()
      return res.render('enterprises', { enterprises })
    }
  }
}

module.exports = controller
