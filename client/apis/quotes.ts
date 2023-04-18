import request from 'superagent'

const rootUrl = '/api/v1/quotes'

export async function getQuoteForFilm(filmName: string, actorName: string) {
  try {
    const response = await request
      .get(`${rootUrl}?movie=${filmName}&actor=${actorName}`)
      .accept('application/json')

    const quote = response.body.quote
    return quote
  } catch (error) {
    console.error((error as Error).message)
    return Promise.reject((error as Error).message)
  }
}
