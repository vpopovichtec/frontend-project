import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useDebounce } from "@/hooks/useDebounce";
import type { Movie } from "@/types/movie";
import type { PaginatedResponse } from "@/types/paginatedResponse";
import { POPULAR_MOVIES_ENDPOINT } from "@/constants/routes";
import { buildSearchEndpoint } from "@/helpers/buildSearchEndpoint";
import { MovieCard } from "@/components/MovieCard";
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton";
import { SearchInput } from "@/components/SearchInput";

export function HomePage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const trimmedQuery = debouncedQuery.trim();

  const endpoint = trimmedQuery
    ? buildSearchEndpoint(trimmedQuery)
    : POPULAR_MOVIES_ENDPOINT;

  const { data, loading, error } = useFetch<PaginatedResponse<Movie>>(endpoint);

  const noResults = !loading && data?.results.length === 0;

  return (
    <div>
      <div className="flex flex-col items-center">
        <SearchInput value={query} onChange={setQuery} />
      </div>
      {error ? (
        <p className="p-4 text-center">{error.message}</p>
      ) : noResults ? (
        <p className="p-4 text-center">No movies found for "{trimmedQuery}"</p>
      ) : (
        <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 20 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            : data?.results.map((movie) => (
                <MovieCard key={movie.id} {...movie} />
              ))}
        </div>
      )}
    </div>
  );
}
