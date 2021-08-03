import { NextFunction, Request, Response, Router } from 'express'
// Import all the routes
import { newsRouter } from './news'
import { webhookRouter } from './webhook'
import { sign, verify } from 'jsonwebtoken'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  if(req.headers.authorization){
    try {
      verify(req.headers.authorization.split('Bearer ')[1], process.env.API_SECRET+'')
      return next()
    } catch (e) {
      return res.status(401).send('Unauthorized')
    }
  } else
    return res.status(401).send('Unauthorized')
};

const verifyWebhookToken = (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization === 'Bearer C4Sp3rB07BE3TR0OT1w56rgrt1hb56twef')
      return next()
    else
      return res.status(401).send('Unauthorized')
}
// Use all these routes in the router
let apiRouter = Router()
  .get('/authenticate', verifyToken, (req, res) => {
    res.status(200).json('Your token works.')
  })
  .post('/authenticate', (req, res) => {
    if (req.body.password) {
      if(req.body.password+'' === process.env.API_PASSWORD+'') {
        res.status(200).json(sign({ verified: true }, process.env.API_SECRET+'', {
          expiresIn: '10 minutes'
        }))
      } else
        res.status(403).send("Wrong password")
    } else 
      res.status(400).send("No password provided")
  })
  .use('/news', verifyToken, newsRouter)
  .use('/webhook', verifyWebhookToken, webhookRouter)
//.use('/anotherpath', another_route)

export { apiRouter }