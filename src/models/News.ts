import { Document, Schema, model } from 'mongoose'
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts'

interface News extends Document {
  title: String,
  description: String,
  category: String,
  picture_url: String,
  news_url: String
}

// Define Task schema
const NewsSchema = new Schema<News>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Esporte','Política','Entretenimento','Famosos']},
  picture_url: { type: String, required: true },
  news_url: { type: String, required: true, unique: true },
  created_at: { type: Date, default: new Date().toISOString() }
})

NewsSchema.plugin(mongoosePagination)
// Generate and register the Mongoose model from the schema
const newsModel = model<News, Pagination<News>>('News', NewsSchema)

export { newsModel }