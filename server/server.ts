import express from 'express'
import { join } from 'node:path'

import moviesRoutes from './routes/movies'
import quotesRoutes from './routes/quotes'
import genreRoutes from './routes/genres'
import { myApiRoot } from './apiUrls'

const server = express()

server.use(express.json())
server.use(express.static(join(__dirname, 'public')))

server.use(`${myApiRoot}/movies`, moviesRoutes)
server.use(`${myApiRoot}/quotes`, quotesRoutes)
server.use(`${myApiRoot}/genres`, genreRoutes)

export default server
