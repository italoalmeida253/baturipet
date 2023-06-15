const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.resolve('public', 'uploads'))
  },
  filename: (req, file, callback) => {
    const name = crypto.randomBytes(16).toString('hex')
    callback(null, name)
  }
})
const upload = multer({ storage })

module.exports = upload
