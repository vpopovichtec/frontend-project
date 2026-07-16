import { describe, test, expect } from "vitest";
import { buildApiUrl } from "./buildApiUrl";
import { POPULAR_MOVIES_ENDPOINT } from "@/constants/routes";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

describe("buildApiUrl", () => {
  test("joins URL segments", () => {
    expect(buildApiUrl("movie", "popular")).toBe(`${BASE_URL}/movie/popular`);
  });

  // POPULAR_MOVIES_ENDPOINT contant starts with '/'
  test("removes duplicate slashes", () => {
    expect(buildApiUrl(POPULAR_MOVIES_ENDPOINT)).toBe(
      `${BASE_URL}${POPULAR_MOVIES_ENDPOINT}`,
    );
  });

  test("supports multiple path segments", () => {
    expect(buildApiUrl("movie", "123", "credits")).toBe(
      `${BASE_URL}/movie/123/credits`,
    );
  });

  // removes duplicate slashes but not '://'
  test("preserves protocol separator", () => {
    expect(buildApiUrl()).toBe(BASE_URL);
  });
});
