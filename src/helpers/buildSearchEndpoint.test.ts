import { describe, expect, test } from "vitest";
import { buildSearchEndpoint } from "./buildSearchEndpoint";

describe("buildSearchEndpoint", () => {
  test("adds the query parameter", () => {
    expect(buildSearchEndpoint("batman")).toBe("/search/movie?query=batman");
  });

  test("encodes special characters", () => {
    expect(buildSearchEndpoint("fast & furious")).toBe(
      "/search/movie?query=fast%20%26%20furious",
    );
  });
});
