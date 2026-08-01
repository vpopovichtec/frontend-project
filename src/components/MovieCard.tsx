import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/types/movie";
import { resolvePosterPath } from "@/helpers/resolvePosterPath";

export function MovieCard({
  original_title,
  release_date,
  vote_average,
  poster_path,
}: Movie) {
  return (
    <Card>
      <CardHeader className="justify-end">
        <Badge variant="secondary">
          {new Date(release_date).getFullYear()}
        </Badge>
      </CardHeader>
      <CardContent>
        <img
          src={resolvePosterPath(poster_path)}
          alt={original_title}
          className="aspect-[2/3] w-full object-cover"
        />
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-base">{original_title}</p>
        <Badge variant="destructive">{vote_average}</Badge>
      </CardFooter>
    </Card>
  );
}
