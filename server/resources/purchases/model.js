import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  videogameId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
})

export default mongoose.model('Purchase', purchaseSchema)
