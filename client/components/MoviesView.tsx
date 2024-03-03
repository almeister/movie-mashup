import { useEffect, useState } from 'react'

import { Movie } from '../../common/Movies'
import { getMovieCredits, getRandomMovieByGenres } from '../apis/movies'
import MovieView from './MovieView'
import { getQuoteForFilm } from '../apis/quotes'
import { Credit } from '../../common/Credits'
import MovieSurpriseView from './MovieSurpriseView'
import { funnyGenres, seriousGenres } from '../../common/Genres'
import { Inclusion } from '../../common/GenresHelper'

interface MashupData {
  firstMovie: Movie
  secondMovie: Movie
  firstActor: string
  secondActor: string
  quote: string
}

export default function MoviesView() {
  const [movieData, setMovieData] = useState<MashupData>()

  useEffect(() => {
    const fetchMovieData = async () => {
      const movie1 = await getRandomMovieByGenres(
        7.5,
        seriousGenres,
        Inclusion.OR
      )
      console.log(`First movie: ${movie1}`)
      const credits1 = await getMovieCredits(movie1.id)
      const credit1 = credits1.credits[0] as Credit

      // TODO: There's a problem here when the movie1.genres includes genreIds from funnyGenres
      const movie2 = await getRandomMovieByGenres(
        6.2,
        funnyGenres,
        Inclusion.AND,
        movie1.genre_ids
      )
      console.log(`Second movie: ${movie1}`)

      // TODO: Type credit
      const credits = await getMovieCredits(movie2.id)
      // TODO: Randomly select an actor somehow...
      const credit = credits.credits[0] as Credit
      const quote = await getQuoteForFilm(movie2.title, credit.name)
      let trimmedQuote = quote
      if (quote.includes(' -')) {
        console.log(`Splitting quote: ${quote}`)

        const subStrings = quote.split(' -')
        trimmedQuote = subStrings[0]
      }

      setMovieData({
        ...movieData,
        firstMovie: movie1,
        secondMovie: movie2,
        firstActor: credit1.name,
        secondActor: credit.name,
        quote: trimmedQuote,
      })
    }

    fetchMovieData()
  }, [])

  return (
    <>
      <div className="poster-row">
        {movieData ? <MovieView movie={movieData.firstMovie} /> : null}
        {movieData ? <MovieSurpriseView movie={movieData.secondMovie} /> : null}
      </div>
      {movieData ? (
        <article>
          <p>{`Remember that movie ${movieData.firstMovie.title} where ${movieData.firstActor} was all like:`}</p>
          <p>{movieData.quote}</p>
        </article>
      ) : null}
    </>
  )
}
