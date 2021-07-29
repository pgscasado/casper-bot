import { Router } from 'express'
// Import all the routes
import { newsRouter } from './news'
import { webhookRouter } from './webhook'

// Use all these routes in the router
let apiRouter = Router()
  .use('/news', newsRouter)
  .use('/webhook', webhookRouter)
//.use('/anotherpath', another_route)

export { apiRouter }