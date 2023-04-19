import { useEffect, useState } from 'react'

import { Movie } from '../../common/Movies'
import {
  getMovieCredits,
  getRandomMovieExcludeGenre,
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
      const movie1 = await getRandomMovie()
      console.log(movie1)

      const movie2 = await getRandomMovieExcludeGenre(movie1.genre_ids)
      console.log(movie2)

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
        firstMovie: movie1,
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
