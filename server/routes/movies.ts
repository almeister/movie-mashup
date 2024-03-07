import express from 'express'
import request from 'superagent'

import { tmdbToken } from '../auth'
import { tmdbApiUrl } from '../apiUrls'
import { Movie } from '../../common/Movies'
import { Credit } from '../../common/Credits'

const router = express.Router()

interface MoviesResponse {
  page: number
  results: Movie[]
  total_results: number
  total_pages: number
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

// TODO: Remove actorId?
router.get(
  '/random/:actorId?:excludeGenreId?:includeGenreIds?:minAverageRating?',
  async (req, res) => {
    const excludedGenreIds = req.query?.excludeGenreId || null
    const actorId = req.query?.actorId || null
    const includedGenreIds = req.query?.includeGenreIds || null
    const minAverageRating = req.query?.minAverageRating || null

    const query = `?language=en-US&with_original_language=en&primary_release_date.gte=1984-01-01&primary_release_date.lte=1999-12-31&vote_average.gte=${minAverageRating}&vote_count.gte=100&without_genres=${excludedGenreIds}`
    // const query = `?language=en-US&with_original_language=en&primary_release_date.gte=1984-01-01&primary_release_date.lte=2014-12-31&vote_average.gte=${minAverageRating}&vote_count.gte=1000&with_genres=${includedGenreIds}&without_genres=${excludedGenreIds}`
    // const query = `?language=en-US`
    // const endPoint = `${tmdbApiUrl}/movie/top_rated${query}`
    const endPoint = `${tmdbApiUrl}/discover/movie${query}`

    try {
      const firstPage = await request
        .get(endPoint)
        .set('Content-Type', 'application/json')
        .auth(tmdbToken, { type: 'bearer' })

      if (isMovies(firstPage.body)) {
        const numberOfPages = Math.min(firstPage.body.total_pages, 500) // Hard limit is 500 on /discover/movie pages: https://developers.themoviedb.org/3/discover/movie-discover
        console.log(`Number of pages: ${numberOfPages}`)
        console.log(`Number of results: ${firstPage.body.total_results}`)
        const randomPageNum = randomNumInRange(1, numberOfPages)
        const endPointWithPage = endPoint + `&page=${randomPageNum}`
        console.log(endPointWithPage)
        // console.log(firstPage.body)

        const randomPage = await request
          .get(endPointWithPage)
          .set('Content-Type', 'application/json')
          .auth(tmdbToken, { type: 'bearer' })

        // console.log(randomPage.body)

        if (isMovies(randomPage.body)) {
          const movies = randomPage.body.results
          const randomMovieIndex = randomNumInRange(0, movies.length)
          res.status(200).json(movies[randomMovieIndex])
        } else {
          res
            .status(500)
            .json({ error: 'Page of movies not found at external API.' })
        }
      } else {
        res.status(500).json({ error: 'Movies not found at external API.' })
      }
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  }
)

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
