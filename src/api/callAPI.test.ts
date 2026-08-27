import { describe, expect, test, vi, beforeEach } from "vitest";
import { callAPI } from "./callAPI";
import type { Movie } from "@/types/movie";
import type { PaginatedResponse } from "@/types/paginatedResponse";
import { POPULAR_MOVIES_ENDPOINT } from "@/constants/routes";

// Literals, not values derived from import.meta.env or from buildApiUrl().
// Deriving the expectation from the same source the implementation uses would
// make these assertions hold no matter what that source produced. `.env.test`
// pins VITE_TMDB_BASE_URL and VITE_TMDB_TOKEN to exactly these values.
const POPULAR_MOVIES_URL = "https://api.themoviedb.org/3/movie/popular";
const AUTH_HEADER = "Bearer test-token";

describe("callAPI", () => {
  beforeEach(() => {
    // Mock fetch
    globalThis.fetch = vi.fn();
  });

  test("throws on HTTP error", async () => {
    // Return failed response
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await expect(
      callAPI<PaginatedResponse<Movie>>([POPULAR_MOVIES_ENDPOINT]),
    ).rejects.toThrow(`HTTP error! Status: 401`);
  });

  test("throws on network error", async () => {
    // Return error on network failure
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    await expect(
      callAPI<PaginatedResponse<Movie>>([POPULAR_MOVIES_ENDPOINT]),
    ).rejects.toThrow("Network error");
  });

  test("calls fetch with the correct URL and headers", async () => {
    // 1. Tell the mock what to return
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [],
      }),
    } as Response);

    // 2. Call callAPI()
    await callAPI<PaginatedResponse<Movie>>([POPULAR_MOVIES_ENDPOINT]);

    // 3. Verify fetch was called one time
    expect(fetch).toHaveBeenCalledTimes(1);

    // 4. Verify it was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith(
      POPULAR_MOVIES_URL,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: AUTH_HEADER,
          accept: "application/json",
        }),
      }),
    );
  });

  test("passes the abort signal to fetch", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [],
      }),
    } as Response);

    const controller = new AbortController();

    await callAPI<PaginatedResponse<Movie>>(
      [POPULAR_MOVIES_ENDPOINT],
      controller.signal,
    );

    expect(fetch).toHaveBeenCalledWith(
      POPULAR_MOVIES_URL,
      expect.objectContaining({
        signal: controller.signal,
      }),
    );
  });
});
