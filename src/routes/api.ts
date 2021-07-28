import { Router } from 'express'
// Import all the routes
import { newsRouter } from './news'

// Use all these routes in the router
let apiRouter = Router()
  .use('/news', newsRouter)
//.use('/anotherpath', another_route)

export { apiRouter }