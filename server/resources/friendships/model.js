import mongoose from 'mongoose'

const friendshipSchema = new mongoose.Schema({
  userIds: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
})

export default mongoose.model('Friendship', friendshipSchema)
