const Client = require('@models/Client')
const Publication = require('@models/Publication')
const Tokens = require('csrf')
const tokens = new Tokens()

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
  profile: {
    async get (req, res) {
      const { id, username, likes, name, profilePic } = req.session.user

      const publications = await Publication
        .find({ author: id })
        .populate(['author', 'comments'])
        .exec()

      const relativePublications = filterPublications(publications, likes)

      return res.render('clients/profile', {
        name,
        username,
        profilePic,
        publications: relativePublications
      })
    }
  },
  publish: {
    get (req, res) {
      const { username, secret } = req.session.user
      const token = tokens.create(secret)
      res.render('clients/publish', { username, token })
    },
    async post (req, res) {
      const { username } = req.session.user
      const { filename } = req.file
      const { description } = req.body

      const user = await Client.findOne({ username }).exec()

      const publication = new Publication({
        author: user._id,
        description,
        likes: 0,
        imagePath: `/uploads/${filename}`
      })

      const location = req.body.location
      if (location) {
        const [longitude, latitude] = location.split(';')
        publication.longitude = longitude
        publication.latitude = latitude
      }

      user.publications.push(publication._id)

      Promise.all([user.save(), publication.save()])

      return res.redirect('/client/profile')
    }
  },
  inbox: {
    get (req, res) {
      return res.render('clients/inbox')
    }
  },
  editPublication: {
    async get (req, res) {
      const { publication: publicationId } = req.params
      const publication = await Publication.findById(publicationId).exec()
      if (!publication) {
        return res.redirect('/')
      }

      return res.render('clients/edit-publication', {
        publication
      })
    },
    async post (req, res) {
      const { publication: publicationId } = req.params
      const publication = await Publication.findById(publicationId).exec()
      if (!publication) {
        console.log('nao encontrada')
        return res.redirect('/')
      }

      const { description } = req.body
      const location = req.body.location

      if (description) {
        console.log(description)
        publication.description = description
      }
      if (location) {
        console.log(location)
        const [longitude, latitude] = location.split(';')
        publication.longitude = longitude
        publication.latitude = latitude
      }

      await publication.save()
      return res.redirect('/')
    }
  },
  deletePublication: {
    get (req, res) {
      const { publication: publicationId } = req.params
      return res.render('clients/delete-publication', {
        publicationId
      })
    },
    async post (req, res) {
      const { publication: publicationId } = req.params
      const exist = await Publication.findById(publicationId).exec()
      if (!exist) {
        return res.redirect('/client/profile')
      }
      await Publication.deleteOne({ _id: publicationId })
      return res.redirect('/client/profile')
    }
  }
}

module.exports = controller
