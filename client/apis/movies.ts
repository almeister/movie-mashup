import request from 'superagent'

import { Movie } from '../../common/Movies'
import { myApiRoot } from '../../server/apiUrls'

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
    .join(', ')
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
