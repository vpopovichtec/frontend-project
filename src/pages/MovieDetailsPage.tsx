import { useParams } from "react-router";
import { useFetch } from "@/hooks/useFetch";
import type { MovieDetails } from "@/types/movieDetails";
import { resolvePosterPath } from "@/helpers/resolvePosterPath";

export function MovieDetailsPage() {
  const { id } = useParams();

  const { data, loading, error } = useFetch<MovieDetails>(`/movie/${id}`);

  if (error) return <p className="p-4 text-center">{error.message}</p>;

  if (loading) return <p className="p-4 text-center">Loading...</p>;

  if (!data) return <p className="p-4 text-center">No movie found.</p>;

  return (
    <div>
      <div>
        <img
          src={resolvePosterPath(data.poster_path)}
          alt={data.original_title}
        />
        <div>
          <h1>{data.original_title}</h1>
          <p>{data.overview}</p>
          <div>
            {data.genres.map((genre) => (
              <p key={genre.id}>{genre.name}</p>
            ))}
          </div>
          <p>{data.vote_average}</p>
        </div>
      </div>
    </div>
  );
}
