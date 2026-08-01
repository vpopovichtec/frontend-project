import "./App.css";
import { useFetch } from "./hooks/useFetch";
import type { Movie } from "./types/movie";
import type { PaginatedResponse } from "./types/paginatedResponse";
import { POPULAR_MOVIES_ENDPOINT } from "./constants/routes";
import { MovieCard } from "./components/MovieCard";
import { MovieCardSkeleton } from "./components/MovieCardSkeleton";
import { Badge } from "@/components/ui/badge";

function App() {
  const { data, loading, error } = useFetch<PaginatedResponse<Movie>>(
    POPULAR_MOVIES_ENDPOINT,
  );

  if (error) {
    return <div>{error.message}</div>;
  }

  console.log(data?.results);

  return (
    <div>
      <div className="p-4 mt-2 flex justify-center">
        <Badge variant="outline" className="p-6 text-4xl">
          TMDB Movie Explorer
        </Badge>
      </div>
      <div className="p-4 grid grid-cols-5 gap-4">
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
