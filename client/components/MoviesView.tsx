import { useEffect, useState } from 'react'

import { Movie } from '../../common/Movies'
import {
  getMovieCredits,
  getRandomMovieByActorId,
  getRandomMovie,
} from '../apis/movies'
import MovieView from './MovieView'
import { getQuoteForFilm } from '../apis/quotes'

interface MashupData {
  firstMovie: Movie
  secondMovie: Movie
  actor: string
  quote: string
}

export default function MoviesView() {
  const [movieData, setMovieData] = useState<MashupData>()

  useEffect(() => {
    const fetchMovieData = async () => {
      const movie = await getRandomMovie()

      const movie2 = await getRandomMovie()
      // TODO: Type credit
      const credits = await getMovieCredits(movie2.id)
      // TODO: Randomly select an actor somehow...
      const credit = credits.credits[0]
      const quote = await getQuoteForFilm(movie2.title, credit.name)
      let trimmedQuote = quote
      if (quote.includes(' -')) {
        console.log(quote)

        const subStrings = quote.split(' - ')
        trimmedQuote = subStrings[0]
      }

      setMovieData({
        ...movieData,
        firstMovie: movie,
        secondMovie: movie2,
        actor: credit.name,
        quote: trimmedQuote,
      })
    }

    fetchMovieData()
  }, [])

  return (
    <>
      <div className="poster-row">
        {movieData ? <MovieView movie={movieData.firstMovie} /> : null}
        {movieData ? <MovieView movie={movieData.secondMovie} /> : null}
      </div>
      {movieData ? (
        <article>
          <p>{`Remember that movie ${movieData.firstMovie.title} where ${movieData.actor} was all like:`}</p>
          <p>{movieData.quote}</p>
        </article>
      ) : null}
    </>
  )
}
