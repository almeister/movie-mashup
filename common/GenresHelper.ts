import { Genre, funnyGenres, seriousGenres } from './Genres'

export enum Inclusion {
  AND = 0,
  OR = 1,
}

export function genresToIdsString(
  genres: Genre[],
  inclusion: Inclusion = Inclusion.AND
) {
  return genres
    .map((genre) => genre.id)
    .join(inclusion == Inclusion.AND ? ',' : '|')
}

export function funnyGenresAsString() {
  return genresToIdsString(funnyGenres)
}

export function seriousGenresAsString() {
  return genresToIdsString(seriousGenres)
}
