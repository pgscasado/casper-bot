import express from 'express'
import bp from 'body-parser'
import path from 'path'
import dateformat from 'dateformat'
import { apiRouter } from './routes/api'

class App {
  // Express app
  public express : express.Application

  constructor () {
    // Express app init
    this.express = express()
    // Run configuration function
    this.config()
  }

	private config () : void {
    // Make possible getting JSON from the requests
    this.express.use(express.json())

  	// Enable CORS
  	this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  		res.header('Access-Control-Allow-Origin', '*')
  		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  		next()
    })
    
  	// Simple Route Logging
  	this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  		console.log(`INCOMING ${req.method} REQUEST AT ${dateformat(new Date(), 'longTime', true)}: from ${req.connection.remoteAddress} into ${req.path}`)
  		next()
    })
    
    console.log(path.join(__dirname, '../frontend'))
    this.express.use('/', express.static(path.join(__dirname,'../frontend')))
    this.express.use('/libs', express.static(path.join(__dirname, '../frontend/node_modules')))
    // Use API routes

    this.express.use('/api', apiRouter)
    
  }
}

export { App }