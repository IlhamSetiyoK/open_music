const Joi = require('joi')

const SongPayLoadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(1).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().min(1).required(),
  albumId: Joi.string().required()
})

module.exports = { SongPayLoadSchema }
