import { Router } from 'express'
import { newsModel } from '../models/News'

export const newsRouter = Router()
  // Handle GET 'api/newss/'
  .get('/', (req, res) => {
    newsModel.paginate({
      page: req.query.page || 1,
      sort: { created_at: -1 },
      limit: 5
    }).then(
      (docs) => { res.status(200).json(docs) },
      (err) => { console.error(err.message); res.status(500).json(err.message); }
    )
  })
  // Handle GET 'api/newss/:id'
  .get('/:id', (req, res) => {
    newsModel.findById(req.params.id).then(
      (doc) => { res.status(doc ? 200 : 404).json(doc||'Notícia não encontrada') },
      (err) => { console.error(err.message); res.status(500).json(err.message); }
    )
  })
  // Handle POST 'api/newss/'
  .post('/', (req, res) => {
    req.body['created_at'] = new Date().toISOString();
    newsModel.create(req.body).then(
      (doc) => { res.status(200).json(doc) },
      (err) => { if (err.code === 11000) {
        res.status(409).json('Não é possível criar outra notícia com essa URL')
      } else { 
        console.error(err.message); res.status(500).json(err.message); 
      }
    })
  })
  .delete('/:id', (req, res) => {
    newsModel.findByIdAndDelete(req.params.id).then(
      (doc) => { res.status(doc ? 200 : 404).json(doc||'Notícia não encontrada') },
      (err) => { console.error(err.message); res.status(500).json(err.message); }
    )
  })
  .patch('/:id', (req, res) => {
    newsModel.findByIdAndUpdate(req.params.id, req.body).then(
      (doc) => { res.status(doc ? 200 : 404).json(doc||'Notícia não encontrada') },
      (err) => { 
        if (err.code === 11000) {
          res.status(409).json('Não é possível criar outra notícia com essa URL')
        } else { 
          console.error(err.message); res.status(500).json(err.message); 
        }
      }
    )
  })