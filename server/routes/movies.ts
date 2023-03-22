import express from 'express'

import request from 'superagent'

const router = express.Router()

/*

NOTES

I can use Bearer token with the v3 API.

Discover - to find films by genre for example 
https://developers.themoviedb.org/3/discover/movie-discover

Genre list
https://developers.themoviedb.org/3/genres/get-movie-list

Lists - can get for a specific movie
https://developers.themoviedb.org/3/movies/get-movie-lists

Movies - popular and top-rated might be a good source
https://developers.themoviedb.org/3/movies/get-popular-movies

Trending Movies
https://developers.themoviedb.org/3/trending/get-trending

Search - keywords, movies and people might be useful
https://developers.themoviedb.org/3/search/search-keywords

*/

const apiUrl = 'https://api.themoviedb.org/3'

interface Movie {
  poster_path: string
  genre_ids: number[]
  id: number
  title: string
  backdrop_path: string
}

interface TopRatedMovies {
  page: number
  results: Movie[]
  total_results: number
  total_pages: number
}

function isTopRatedMovies(data: any): data is TopRatedMovies {
  return 'results' in data
}

router.get('/random', (req, res) => {
  const apiToken =
    process.env.TMDB_AUTH_TOKEN || 'No auth token loaded from .env file.'

  request
    .get(`${apiUrl}/movie/top_rated`)
    .set('Content-Type', 'application/json')
    .auth(apiToken, { type: 'bearer' })
    .then((response) => {
      if (isTopRatedMovies(response.body)) {
        const movies = response.body.results
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

export default router
