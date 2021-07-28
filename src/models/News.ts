import mongoose from 'mongoose'

interface News {
  title: String,
  description: String,
  category: String,
  picture_url: String,
  news_url: String
}

// Define Task schema
const NewsSchema = new mongoose.Schema<News>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Esporte','Política','Entretenimento','Famosos']},
  picture_url: { type: String, required: true },
  news_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now() }
})

// Generate and register the Mongoose model from the schema
const newsModel = mongoose.model<News>('News', NewsSchema)

export { newsModel }