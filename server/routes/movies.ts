import express from 'express'
import request from 'superagent'

import { tmdbToken } from '../auth'
import { Movie } from '../../common/Movies'

const router = express.Router()

const apiUrl = 'https://api.themoviedb.org/3'

interface TopRatedMovies {
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

function isMovies(data: any): data is TopRatedMovies {
  return 'results' in data
}

function isCredits(data: any): data is Credits {
  return 'cast' in data
}

router.get('/random', (req, res) => {
  request
    .get(`${apiUrl}/movie/top_rated`)
    .set('Content-Type', 'application/json')
    .auth(tmdbToken, { type: 'bearer' })
    .then((response) => {
      if (isMovies(response.body)) {
        const movies = response.body.results

        // TODO: Randomise page
        // const firstPage = response.body
        // console.log(firstPage)
        // const randomPage = Math.floor(Math.random() * firstPage.total_pages)

        // TODO: Check for english language
        const randomMovie = movies[Math.floor(Math.random() * movies.length)]

        res.status(200).json(randomMovie)
      } else {
        res.status(500).json({ error: 'Movies not found at external API.' })
      }
    })
    .catch((error) => {
      res.status(500).json({ error: (error as Error).message })
    })
})

router.get('/random/:actorId', (req, res) => {
  const actorId = req.params.actorId

  request
    .get(`${apiUrl}/discover/movie/?with_cast=${actorId}`)
    .set('Content-Type', 'application/json')
    .auth(tmdbToken, { type: 'bearer' })
    .then((response) => {
      if (isMovies(response.body)) {
        const movies = response.body.results
        // TODO: Check for english language
        const randomMovie = movies[Math.floor(Math.random() * movies.length)]

        res.status(200).json(randomMovie)
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
    .get(`${apiUrl}/movie/${movieId}/credits`)
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
