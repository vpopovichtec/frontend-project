import { describe, expect, it } from "vitest";
import { resolvePosterPath } from "./resolvePosterPath";

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

describe("resolvePosterPath", () => {
  it("returns the full image URL when posterPath is provided", () => {
    const posterPath = "/abc123.jpg";

    expect(resolvePosterPath(posterPath)).toBe(
      `${IMAGE_BASE_URL}${posterPath}`,
    );
  });

  it("returns the placeholder image when posterPath is null", () => {
    expect(resolvePosterPath(null)).toBe("/placeholder.jpg");
  });
});
