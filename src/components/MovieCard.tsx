import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@/types/movie";
import { resolvePosterPath } from "@/helpers/posterPath";

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
        <img src={resolvePosterPath(poster_path)} alt={original_title} />
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-base">{original_title}</p>
        <Badge variant="destructive">{vote_average}</Badge>
      </CardFooter>
    </Card>
  );
}
