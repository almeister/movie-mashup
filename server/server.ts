import express from 'express'
import { join } from 'node:path'

import moviesRoutes from './routes/movies'
import quotesRoutes from './routes/quotes'

const server = express()

server.use(express.json())
server.use(express.static(join(__dirname, 'public')))

server.use('/api/v1/movies', moviesRoutes)
server.use('/api/v1/quotes', quotesRoutes)

export default server
