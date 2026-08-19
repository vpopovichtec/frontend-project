import "./App.css";
import { useState } from "react";
import { useFetch } from "./hooks/useFetch";
import type { Movie } from "./types/movie";
import type { PaginatedResponse } from "./types/paginatedResponse";
import { POPULAR_MOVIES_ENDPOINT } from "./constants/routes";
import { MovieCard } from "./components/MovieCard";
import { MovieCardSkeleton } from "./components/MovieCardSkeleton";
import { SearchInput } from "./components/SearchInput";
import { Badge } from "@/components/ui/badge";
import filmReel from "@/assets/film-reel-96.png";

function App() {
  const [query, setQuery] = useState("");
  const { data, loading, error } = useFetch<PaginatedResponse<Movie>>(
    POPULAR_MOVIES_ENDPOINT,
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      <div className="p-4 mt-2 flex flex-col items-center gap-4">
        <Badge variant="outline" className="p-6 text-1xl sm:text-2xl">
          <img
            src={filmReel}
            alt="film reel"
            className="w-5 h-5 sm:w-8 sm:h-8"
          />
          TMDB Movie Explorer
        </Badge>
        <SearchInput value={query} onChange={setQuery} />
      </div>
      <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {loading
          ? Array.from({ length: 20 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))
          : data?.results.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
      </div>
    </div>
  );
}

export default App;
