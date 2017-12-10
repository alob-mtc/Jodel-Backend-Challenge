import mongoose from 'mongoose'

let schema = new mongoose.Schema({
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
    type: String,
  },
  image_url: {
    type: String,
  },
  buy_url: {
    type: String,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
})
// schema.plugin(snakeToCamel)
// export default mongoose.model('Book', schema)

export default schema
