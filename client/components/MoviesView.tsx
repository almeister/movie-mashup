import { useEffect, useState } from 'react'

import { Movie } from '../../common/Movies'
import { getMovieCredits, getRandomMovieExcludeGenres } from '../apis/movies'
import { getQuoteForFilm } from '../apis/quotes'
import { Credit } from '../../common/Credits'
import MovieSurpriseView from './MovieSurpriseView'
import { alwaysExcludedGenres } from '../../common/Genres'

interface MashupData {
  firstMovie: Movie
  secondMovie?: Movie
  firstActor: string
  secondActor?: string
  quote: string
}

export default function MoviesView() {
  const [movieData, setMovieData] = useState<MashupData>()

  useEffect(() => {
    const fetchMovieData = async () => {
      const movie1 = await getRandomMovieExcludeGenres(
        alwaysExcludedGenres,
        7.5
      )
      console.log('First movie: ', movie1)
      const credits1 = await getMovieCredits(movie1.id)
      const credit1 = credits1.credits[0] as Credit

      // TODO: There's a problem here when the movie1.genres includes genreIds from funnyGenres
      // const movie2 = await getRandomMovieByGenres(
      //   6.2,
      //   funnyGenres,
      //   Inclusion.AND,
      //   movie1.genre_ids
      // )
      // console.log('Second movie: ', movie2.title)

      // TODO: Type credit
      const credits = await getMovieCredits(movie1.id)
      // TODO: Randomly select an actor somehow...
      const credit = credits.credits[0] as Credit
      const quote = await getQuoteForFilm(movie1.title, credit.name)
      let trimmedQuote = quote
      if (quote.includes(' -')) {
        console.log(`Splitting quote: ${quote}`)

        const subStrings = quote.split(' -')
        trimmedQuote = subStrings[0]
      }

      setMovieData({
        ...movieData,
        firstMovie: movie1,
        firstActor: credit1.name,
        quote: trimmedQuote,
      })
    }

    fetchMovieData()
  }, [])

  return (
    <>
      <div className="poster-row">
        {movieData ? <MovieSurpriseView movie={movieData.firstMovie} /> : null}
      </div>
      {movieData ? (
        <article>
          <p>{`Remember that movie with ${movieData.firstActor} when someone said:`}</p>
          <p>{movieData.quote}</p>
        </article>
      ) : null}
    </>
  )
}
