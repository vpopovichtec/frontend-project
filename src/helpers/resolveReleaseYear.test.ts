import { describe, expect, test } from "vitest";
import { resolveReleaseYear } from "./resolveReleaseYear";

describe("resolveReleaseYear", () => {
  test("returns the year", () => {
    expect(resolveReleaseYear("2026-01-01")).toBe("2026");
  });

  test("returns N/A when there is no release date", () => {
    expect(resolveReleaseYear("")).toBe("N/A");
  });

  test("returns N/A when the release date cannot be parsed", () => {
    expect(resolveReleaseYear("soon")).toBe("N/A");
  });
});
