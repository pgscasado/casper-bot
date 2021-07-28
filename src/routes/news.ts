import { Router } from 'express'
import { Document, Error } from 'mongoose'
import { newsModel } from '../models/News'

let newsRouter = Router()
  // Handle GET 'api/newss/'
  .get('/', (req, res) => {
    newsModel.find().then(
      (docs) => { res.status(200).json(docs) },
      (err) => { console.error(err.message); res.status(500).end(err.message); }
    )
  })
  // Handle GET 'api/newss/:id'
  .get('/:id', (req, res) => {
    newsModel.findById(req.params.id).then(
      (doc) => { res.status(200).json(doc) },
      (err) => { console.error(err.message); res.status(500).end(err.message); }
    )
  })
  // Handle POST 'api/newss/'
  .post('/', (req, res) => {
    newsModel.create(req.body).then(
      (doc) => { res.status(200).json(doc) },
      (err) => { console.error(err.message); res.status(500).end(err.message); }
    )
  })

export { newsRouter }