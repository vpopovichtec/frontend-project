import "./App.css";
import { useFetch } from "./hooks/useFetch";
import type { Movie } from "./types/movie";
import type { PaginatedResponse } from "./types/paginatedResponse";

function App() {
  const { data, loading, error } =
    useFetch<PaginatedResponse<Movie>>("/movie/popular");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {data?.results.map((movie) => (
        <p key={movie.id}>{movie.title}</p>
      ))}
    </div>
  );
}

export default App;
