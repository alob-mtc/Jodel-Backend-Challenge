import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
  },
  pages: {
    type: Number,
  },
  image_url: {
    type: String,
  },
  buy_url: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

export default schema
