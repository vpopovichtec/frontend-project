import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useFetch } from "./useFetch";
import type { Movie } from "@/types/movie";
import type { PaginatedResponse } from "@/types/paginatedResponse";
vi.mock("@/api/callAPI", () => ({
  callAPI: vi.fn(),
}));
import { callAPI } from "@/api/callAPI";

test("starts in loading state", async () => {
  const { result } = renderHook(() => useFetch<Movie[]>("/movie/popular"));

  expect(result.current.loading).toBe(true);
  expect(result.current.data).toBeNull();
  expect(result.current.error).toBeNull();
});

test("stores fetched data", async () => {
  const mockResponse: PaginatedResponse<Movie> = {
    page: 1,
    results: [
      {
        adult: false,
        backdrop_path: "...",
        genre_ids: [27, 53],
        id: 1339713,
        original_language: "en",
        original_title: "Obsession",
        overview: "...",
        popularity: 727.1424,
        poster_path: "...",
        release_date: "2026-05-13",
        softcore: false,
        title: "Obsession",
        video: false,
        vote_average: 8.265,
        vote_count: 2843,
      },
    ],
    total_pages: 1,
    total_results: 1,
  };

  vi.mocked(callAPI).mockResolvedValue(mockResponse);

  const { result } = renderHook(() =>
    useFetch<PaginatedResponse<Movie>>("/movie/popular"),
  );

  await waitFor(() => expect(result.current.loading).toBe(false));

  expect(result.current.error).toBeNull();
  expect(result.current.data).toEqual(mockResponse);
});

test("stores error", async () => {
  vi.mocked(callAPI).mockRejectedValue(new Error("Failed to fetch data"));

  const { result } = renderHook(() =>
    useFetch<PaginatedResponse<Movie>>("/movie/popular"),
  );

  await waitFor(() => expect(result.current.loading).toBe(false));

  expect(result.current.error?.message).toBe("Failed to fetch data");
  expect(result.current.data).toBeNull();
});

test("loading becomes false", async () => {
  vi.mocked(callAPI).mockRejectedValue(new Error("Failed to fetch data"));

  const { result } = renderHook(() =>
    useFetch<PaginatedResponse<Movie>>("/movie/popular"),
  );

  await waitFor(() => expect(result.current.loading).toBe(false));
});
