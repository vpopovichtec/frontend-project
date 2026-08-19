export function resolveReleaseYear(releaseDate: string): string {
  const year = new Date(releaseDate).getFullYear();

  return Number.isNaN(year) ? "N/A" : year.toString();
}
