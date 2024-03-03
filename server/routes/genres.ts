import express from 'express'
import request from 'superagent'

import { tmdbToken } from '../auth'
import { tmdbApiUrl } from '../apiUrls'

const router = express.Router()

router.get('/', (req, res) => {
  request
    .get(`${tmdbApiUrl}/genre/movie/list`)
    .set('Content-Type', 'application/json')
    .auth(tmdbToken, { type: 'bearer' })
    .then((response) => {
      if ('genres' in response.body) {
        res.status(200).json({ genres: response.body.genres })
      } else {
        res.status(500).json({ error: 'Genres not found at external API.' })
      }
    })
    .catch((error) => {
      res.status(500).json({ error: (error as Error).message })
    })
})

export default router
