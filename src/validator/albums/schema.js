const Joi = require('joi')

const AlbumPayLoadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().min(1).required()
})

module.exports = { AlbumPayLoadSchema }
