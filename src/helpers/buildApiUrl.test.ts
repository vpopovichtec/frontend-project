import { describe, test, expect } from "vitest";
import { buildApiUrl } from "./buildApiUrl";
import { POPULAR_MOVIES_ENDPOINT } from "@/constants/routes";

// Hardcoded, not read from import.meta.env. Deriving the expected value from
// the same env var the implementation reads would make these assertions pass
// for any value, including undefined. `.env.test` pins VITE_TMDB_BASE_URL to
// exactly this string.
const BASE_URL = "https://api.themoviedb.org/3";

describe("buildApiUrl", () => {
  test("joins URL segments", () => {
    expect(buildApiUrl("movie", "popular")).toBe(
      "https://api.themoviedb.org/3/movie/popular",
    );
  });

  // POPULAR_MOVIES_ENDPOINT constant starts with '/', so joining it to a base
  // that ends without one would otherwise produce '3//movie/popular'. The
  // 'https://' in the expected value is what proves the protocol survives.
  test("removes duplicate slashes but preserves the protocol separator", () => {
    expect(buildApiUrl(POPULAR_MOVIES_ENDPOINT)).toBe(
      "https://api.themoviedb.org/3/movie/popular",
    );
  });

  test("supports multiple path segments", () => {
    expect(buildApiUrl("movie", "123", "credits")).toBe(
      "https://api.themoviedb.org/3/movie/123/credits",
    );
  });

  test("returns the base URL unchanged when given no segments", () => {
    expect(buildApiUrl()).toBe(BASE_URL);
  });
});
