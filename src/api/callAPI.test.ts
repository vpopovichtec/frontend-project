import { describe, expect, test, vi, beforeEach } from "vitest";
import { callAPI } from "./callAPI";
import type { Movie } from "@/types/movie";
import type { PaginatedResponse } from "@/types/paginatedResponse";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

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
      callAPI<PaginatedResponse<Movie>>("/movie/popular"),
    ).rejects.toThrow(`HTTP error! Status: 401`);
  });

  test("throws on network error", async () => {
    // Return error on network failure
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    await expect(
      callAPI<PaginatedResponse<Movie>>("/movie/popular"),
    ).rejects.toThrow("Network error");
  });

  test("calls fetch with the correct URL and headers", async () => {
    // 2. Tell the mock what to return
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [],
      }),
    } as Response);

    // 3. Call callAPI()
    await callAPI<PaginatedResponse<Movie>>("/movie/popular");

    // 4. Verify fetch was called one time
    expect(fetch).toHaveBeenCalledTimes(1);

    // 5. Verify it was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith(
      `${BASE_URL}/movie/popular`,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: "application/json",
        }),
      }),
    );
  });
});
