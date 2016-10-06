import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  videogameId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
})

export default mongoose.model('Comment', commentSchema)
