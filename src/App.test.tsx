import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));
import { useFetch } from "@/hooks/useFetch";
import App from "./App";
import type { Movie } from "@/types/movie";
import type { PaginatedResponse } from "@/types/paginatedResponse";

test("renders loading", () => {
  vi.mocked(useFetch).mockReturnValue({
    loading: true,
    data: null,
    error: null,
  });

  render(<App />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("renders error", () => {
  vi.mocked(useFetch).mockReturnValue({
    loading: false,
    data: null,
    error: new Error("Failed to fetch data"),
  });

  render(<App />);

  expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
});

test("renders movie list", () => {
  const mockData: PaginatedResponse<Movie> = {
    page: 1,
    results: [
      {
        adult: false,
        backdrop_path: "/backdrop.jpg",
        genre_ids: [28, 12],
        id: 1,
        original_language: "en",
        original_title: "Batman",
        overview: "A movie about Batman.",
        popularity: 100,
        poster_path: "/poster.jpg",
        release_date: "2026-01-01",
        softcore: false,
        title: "Batman",
        video: false,
        vote_average: 8.5,
        vote_count: 1000,
      },
      {
        adult: false,
        backdrop_path: "/backdrop2.jpg",
        genre_ids: [35],
        id: 2,
        original_language: "en",
        original_title: "Superman",
        overview: "A movie about Superman.",
        popularity: 90,
        poster_path: "/poster2.jpg",
        release_date: "2026-02-01",
        softcore: false,
        title: "Superman",
        video: false,
        vote_average: 8.2,
        vote_count: 800,
      },
    ],
    total_pages: 1,
    total_results: 2,
  };

  vi.mocked(useFetch).mockReturnValue({
    loading: false,
    data: mockData,
    error: null,
  });

  render(<App />);

  expect(screen.getByText("Batman")).toBeInTheDocument();
  expect(screen.getByText("Superman")).toBeInTheDocument();
});
