import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <Card>
      <CardHeader className="justify-end">
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-[2/3] w-full object-cover" />
      </CardContent>
      <CardFooter className="justify-between">
        <Skeleton className="h-4 w-1/2" />
      </CardFooter>
    </Card>
  );
}
