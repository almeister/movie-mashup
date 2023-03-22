import express from 'express'
import { join } from 'node:path'

import moviesRoutes from './routes/movies'

const server = express()

server.use(express.json())
server.use(express.static(join(__dirname, 'public')))

server.use('/api/v1/movies', moviesRoutes)

export default server
