import express from 'express'
import request from 'superagent'

import { tmdbToken } from '../auth'
import { tmdbApiUrl } from '../apiUrls'
import { Movie } from '../../common/Movies'

const router = express.Router()

interface MoviesResponse {
  page: number
  results: Movie[]
  total_results: number
  total_pages: number
}

interface Credit {
  id: number
  name: string
  popularity: number
  cast_id: number
  characer: string
  credit_id: number
}

interface Credits {
  id: number
  cast: Credit[]
}

function isMovies(data: any): data is MoviesResponse {
  return 'total_pages' && 'results' in data
}

function isCredits(data: any): data is Credits {
  return 'cast' in data
}

function randomNumInRange(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1))
}

router.get('/random/:actorId?:excludeGenreId?', (req, res) => {
  const excludedGenreIds = req.query?.excludeGenreId || null
  const actorId = req.query?.actorId || null

  const endPoint = `${tmdbApiUrl}/discover/movie?language=en-US&with_original_language=en&primary_release_date.lte=2010-12-30&sort_by=revenue.desc&without_genres=${excludedGenreIds}&with_cast=${actorId}`
  request
    .get(endPoint)
    .set('Content-Type', 'application/json')
    .auth(tmdbToken, { type: 'bearer' })
    .then((response) => {
      if (isMovies(response.body)) {
        const pages = response.body.total_pages
        console.log(pages)
        const randomPage = randomNumInRange(1, pages)
        const endPointWithPage = endPoint + `&page=${randomPage}`
        console.log(endPointWithPage)

        request
          .get(endPoint)
          .set('Content-Type', 'application/json')
          .auth(tmdbToken, { type: 'bearer' })
          .then((resp) => {
            if (isMovies(response.body)) {
              const movies = resp.body.results
              const randomMovie =
                movies[Math.floor(Math.random() * movies.length)]
              res.status(200).json(randomMovie)
            } else {
              res
                .status(500)
                .json({ error: 'Movies not found at external API.' })
            }
          })
          .catch((error) => {
            res.status(500).json({ error: (error as Error).message })
          })
      } else {
        res.status(500).json({ error: 'Movies not found at external API.' })
      }
    })
    .catch((error) => {
      res.status(500).json({ error: (error as Error).message })
    })
})

router.get('/credits/:movieId', (req, res) => {
  const movieId = req.params.movieId

  request
    .get(`${tmdbApiUrl}/movie/${movieId}/credits`)
    .set('Content-Type', 'application/json')
    .auth(tmdbToken, { type: 'bearer' })
    .then((response) => {
      if (isCredits(response.body)) {
        // TODO: Check actor's popularity?
        const castCredits = response.body.cast
        res.status(200).json({ credits: castCredits })
      } else {
        res.status(500).json({ error: 'Movie cast not found at external API.' })
      }
    })
    .catch((error) => {
      res.status(500).json({ error: (error as Error).message })
    })
})

export default router
