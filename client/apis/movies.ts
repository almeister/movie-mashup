import request from 'superagent'

import { Movie } from '../../common/Movies'

const rootUrl = '/api/v1/movies'

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

export async function getRandomMovieByActorId(actorId: number) {
  try {
    const response = await request
      .get(`${rootUrl}/random/${actorId}`)
      .accept('application/json')

    const movie = response.body
    return movie
  } catch (error) {
    console.error((error as Error).message)
    return Promise.reject((error as Error).message)
  }
}
