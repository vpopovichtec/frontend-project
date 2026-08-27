import { describe, expect, it } from "vitest";
import { resolvePosterPath } from "./resolvePosterPath";
import placeholder from "@/assets/placeholder.jpg";

// Literal, not read from import.meta.env: an expectation built from the same
// env var the implementation reads would pass for any value it held.
// `.env.test` pins VITE_TMDB_IMAGE_BASE_URL to exactly this string.
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

describe("resolvePosterPath", () => {
  it("returns the full image URL when posterPath is provided", () => {
    const posterPath = "/abc123.jpg";

    expect(resolvePosterPath(posterPath)).toBe(
      `${IMAGE_BASE_URL}${posterPath}`,
    );
  });

  it("returns the placeholder image when posterPath is null", () => {
    expect(resolvePosterPath(null)).toBe(placeholder);
  });
});
