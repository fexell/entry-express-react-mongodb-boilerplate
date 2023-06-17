import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import formData from 'express-form-data'
import mongoose from 'mongoose'

import { createServer } from 'http'
import { Server } from 'socket.io'

import AuthRoute from './src/Routes/Auth.route.js'
import UserRoute from './src/Routes/User.route.js'

import 'dotenv/config'

const Api             = express()
const Port            = 5000
const HttpServer      = createServer(Api)
const MongoDB         = 'mongodb://127.0.0.1:27017/entry'

export const Socket   = new Server(HttpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

Api.set('ACCESS_TOKEN_SECRET', process.env.ACCESS_TOKEN_SECRET)
Api.set('REFRESH_TOKEN_SECRET', process.env.REFRESH_TOKEN_SECRET)

Api.use(cors({
  credentials: true,
  origin: true,
  exposedHeaders: [ 'SET-COOKIE' ]
}))
Api.use(bodyParser.json())
Api.use(bodyParser.urlencoded({ extended: true }))
Api.use(formData.parse())

Api.use('/api/Auth', AuthRoute)
Api.use('/api/User', UserRoute)

const connection      = mongoose.connect(MongoDB)
  .then(() => console.log(`Mongoose server is running on ${ MongoDB }`))
  .catch((error) => console.error(error))

HttpServer.listen(Port, () => console.log(`API is listening on port ${ Port }`))

export default Api