import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useFetch } from "@/hooks/useFetch";
import { HomePage } from "@/pages/HomePage";
import { mockResponse } from "@/test/mockResponse";
import { POPULAR_MOVIES_ENDPOINT } from "@/constants/routes";

// vi.mock on the top level prevents vitest warnings
// removed beforeAll
vi.mock("@/hooks/useFetch", () => ({
  useFetch: vi.fn(),
}));

vi.mock("@/components/MovieCardSkeleton", () => ({
  MovieCardSkeleton: () => <div data-testid="movie-skeleton" />,
}));

vi.mock("@/components/MovieCard", () => ({
  MovieCard: ({ original_title }: { original_title: string }) => (
    <div>{original_title}</div>
  ),
}));

// Wrap HomePage in MemoryRouter - preserves history in memory, instead of using browser's URL
function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders loading skeletons", () => {
    vi.mocked(useFetch).mockReturnValue({
      loading: true,
      data: null,
      error: null,
    });

    renderHomePage();

    expect(screen.getAllByTestId("movie-skeleton")).toHaveLength(20);
  });

  test("renders error", () => {
    vi.mocked(useFetch).mockReturnValue({
      loading: false,
      data: null,
      error: new Error("Failed to fetch data"),
    });

    renderHomePage();

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("renders movie list", () => {
    vi.mocked(useFetch).mockReturnValue({
      loading: false,
      data: mockResponse,
      error: null,
    });

    renderHomePage();

    expect(screen.getByText("Batman")).toBeInTheDocument();
    expect(screen.getByText("Superman")).toBeInTheDocument();
  });

  test("searches the typed query after the debounce delay", () => {
    vi.useFakeTimers();

    vi.mocked(useFetch).mockReturnValue({
      loading: false,
      data: mockResponse,
      error: null,
    });

    renderHomePage();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "batman" },
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(useFetch).toHaveBeenLastCalledWith("/search/movie?query=batman");
  });

  test("returns to popular movies when the query is cleared", () => {
    vi.useFakeTimers();

    vi.mocked(useFetch).mockReturnValue({
      loading: false,
      data: mockResponse,
      error: null,
    });

    renderHomePage();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "batman" },
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(useFetch).toHaveBeenLastCalledWith(POPULAR_MOVIES_ENDPOINT);
  });

  test("renders a message when the search has no results", () => {
    vi.useFakeTimers();

    vi.mocked(useFetch).mockReturnValue({
      loading: false,
      data: { ...mockResponse, results: [] },
      error: null,
    });

    renderHomePage();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "batman" },
    });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(
      screen.getByText('No movies found for "batman"'),
    ).toBeInTheDocument();
  });
});
