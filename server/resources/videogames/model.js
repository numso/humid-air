import mongoose from 'mongoose'

const videogameSchema = new mongoose.Schema({
  // livin on the edge!
}, {
  minimize: false,
  strict: false,
  timestamps: true,
  versionKey: false,
})

export default mongoose.model('Videogame', videogameSchema)
