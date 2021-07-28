import mongoose from 'mongoose'

// Define Task schema
const News = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Esporte','Política','Entretenimento','Famosos']},
  picture_url: { type: String, required: true },
  news_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now() }
})

// Generate and register the Mongoose model from the schema
const newsModel = mongoose.model('News', News)

export { newsModel }