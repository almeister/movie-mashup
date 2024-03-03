import request from 'superagent'

import { Movie } from '../../common/Movies'
import { myApiRoot } from '../../server/apiUrls'
import { Genre, alwaysExcludedGenres } from '../../common/Genres'
import { Inclusion, genresToIdsString } from '../../common/GenresHelper'

const rootUrl = `${myApiRoot}/movies`

export async function getRandomMovie(): Promise<Movie> {
  try {
    const response = await request
      .get(`${rootUrl}/random`)
      .accept('application/json')

    const movie = response.body as Movie
    return movie
  } catch (error) {
    console.error((error as Error).message)
    return Promise.reject((error as Error).message)
  }
}

export async function getMovieCredits(movieId: number) {
  try {
    const response = await request
      .get(`${rootUrl}/credits/${movieId}`)
      .accept('application/json')

    const credits = response.body
    return credits
  } catch (error) {
    console.error((error as Error).message)
    return Promise.reject((error as Error).message)
  }
}

export async function getRandomMovieExcludeGenre(
  excludedGenreIds: number[]
): Promise<Movie> {
  const genresString = excludedGenreIds
    .map((genreId) => genreId.toString())
    .join(',')
  console.log(genresString)

  try {
    const response = await request
      .get(`${rootUrl}/random/?excludeGenreId=${genresString}`)
      .accept('application/json')

    const movie = response.body
    return movie
  } catch (error) {
    console.error((error as Error).message)
    return Promise.reject((error as Error).message)
  }
}

export async function getRandomMovieExcludeGenres(
  genresToExclude: Genre[]
): Promise<Movie> {
  const excludedGenresString = genresToIdsString(
    genresToExclude.concat(alwaysExcludedGenres)
  )

  try {
    const response = await request
      .get(`${rootUrl}/random/`)
      .accept('application/json')
      .query(`excludeGenreId=${excludedGenresString}`)

    const movie = response.body
    return movie
  } catch (error) {
    console.error((error as Error).message)
    return Promise.reject((error as Error).message)
  }
}

export async function getRandomMovieByGenres(
  minAverageRating: number,
  genres: Genre[],
  inclusion: Inclusion,
  genresToExclude: number[] = []
): Promise<Movie> {
  const genresString = genresToIdsString(genres, inclusion)
  const excludedGenresString = `${genresToIdsString(
    alwaysExcludedGenres
  )},${genresToExclude.join()}`
  console.log(`Excluding genres: ${excludedGenresString}`)

  try {
    const response = await request
      .get(`${rootUrl}/random/`)
      .accept('application/json')
      .query(`minAverageRating=${minAverageRating}`)
      .query(`includeGenreIds=${genresString}`)
      .query(`excludeGenreId=${excludedGenresString}`)

    const movie = response.body
    return movie
  } catch (error) {
    console.error((error as Error).message)
    return Promise.reject((error as Error).message)
  }
}
