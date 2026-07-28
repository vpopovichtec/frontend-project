import { describe, test, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { useFetch } from "@/hooks/useFetch";
import App from "./App";
import { mockResponse } from "./test/mockResponse";

describe("App", () => {
  beforeAll(() => {
    vi.mock("@/hooks/useFetch", () => ({
      useFetch: vi.fn(),
    }));
  });

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
    vi.mocked(useFetch).mockReturnValue({
      loading: false,
      data: mockResponse,
      error: null,
    });

    render(<App />);

    expect(screen.getByText("Batman")).toBeInTheDocument();
    expect(screen.getByText("Superman")).toBeInTheDocument();
  });
});
