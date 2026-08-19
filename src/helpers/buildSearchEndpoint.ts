import { SEARCH_MOVIES_ENDPOINT } from "@/constants/routes";

export function buildSearchEndpoint(query: string): string {
  return `${SEARCH_MOVIES_ENDPOINT}?query=${encodeURIComponent(query)}`;
}
