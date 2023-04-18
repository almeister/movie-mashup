import { Movie } from '../../common/Movies'

const posterUrlPrefix = 'https://image.tmdb.org/t/p/original/'

export interface MovieViewProps {
  movie: Movie
}

export default function MovieView(props: MovieViewProps) {
  const { movie } = props

  return (
    <>
      <div className="poster-column">
        <img
          className="poster"
          src={`${posterUrlPrefix}${movie?.poster_path}`}
          alt={movie?.title}
        />
      </div>
    </>
  )
}
