import { useState } from 'react'

import { Movie } from '../../common/Movies'

const posterUrlPrefix = 'https://image.tmdb.org/t/p/original/'

interface MovieViewProps {
  movie: Movie
}

export default function MovieSurpriseView(props: MovieViewProps) {
  const { movie } = props
  const [showPoster, setShowPoster] = useState(false)

  function handleSurpriseClicked() {
    setShowPoster(true)
  }

  // TODO: Pre-load image
  function getImagePath() {
    return showPoster
      ? `${posterUrlPrefix}${movie?.poster_path}`
      : '/images/surprise.jpg'
  }

  return (
    <>
      <div className="poster-column">
        <img
          className="poster"
          src={getImagePath()}
          alt={movie?.title}
          onClick={handleSurpriseClicked}
        />
      </div>
    </>
  )
}
