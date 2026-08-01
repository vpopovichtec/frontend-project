const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

export function resolvePosterPath(posterPath: string | null): string {
  return posterPath ? `${IMAGE_BASE_URL}${posterPath}` : "/placeholder.jpg";
}
