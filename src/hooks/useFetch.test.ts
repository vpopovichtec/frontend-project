import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useFetch } from "./useFetch";
import type { Movie } from "@/types/movie";
vi.mock("@/api/callAPI", () => ({
  callAPI: vi.fn(),
}));
import { callAPI } from "@/api/callAPI";
import { mockResponse } from "@/test/mockResponse";
import { POPULAR_MOVIES_ENDPOINT } from "@/constants/routes";

describe("useFetch", () => {
  test("starts in loading state", async () => {
    const { result } = renderHook(() =>
      useFetch<Movie[]>(POPULAR_MOVIES_ENDPOINT),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test("stores fetched data", async () => {
    vi.mocked(callAPI).mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useFetch<Movie[]>(POPULAR_MOVIES_ENDPOINT),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockResponse);
  });

  test("stores error", async () => {
    vi.mocked(callAPI).mockRejectedValue(new Error("Failed to fetch data"));

    const { result } = renderHook(() =>
      useFetch<Movie[]>(POPULAR_MOVIES_ENDPOINT),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error?.message).toBe("Failed to fetch data");
    expect(result.current.data).toBeNull();
  });

  test("loading becomes false", async () => {
    vi.mocked(callAPI).mockRejectedValue(new Error("Failed to fetch data"));

    const { result } = renderHook(() =>
      useFetch<Movie[]>(POPULAR_MOVIES_ENDPOINT),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
