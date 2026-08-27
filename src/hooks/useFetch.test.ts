import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { useFetch } from "./useFetch";
import type { Movie } from "@/types/movie";
vi.mock("@/api/callAPI", () => ({
  callAPI: vi.fn(),
}));
import { callAPI } from "@/api/callAPI";
import { mockResponse } from "@/test/mockResponse";
import {
  POPULAR_MOVIES_ENDPOINT,
  SEARCH_MOVIES_ENDPOINT,
} from "@/constants/routes";

describe("useFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  test("resets loading when the endpoint changes", async () => {
    vi.mocked(callAPI).mockResolvedValue(mockResponse);

    const { result, rerender } = renderHook(
      ({ endpoint }) => useFetch<Movie[]>(endpoint),
      { initialProps: { endpoint: POPULAR_MOVIES_ENDPOINT } },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ endpoint: SEARCH_MOVIES_ENDPOINT });

    expect(result.current.loading).toBe(true);
  });

  test("resets error when the endpoint changes", async () => {
    vi.mocked(callAPI).mockRejectedValue(new Error("Failed to fetch data"));

    const { result, rerender } = renderHook(
      ({ endpoint }) => useFetch<Movie[]>(endpoint),
      { initialProps: { endpoint: POPULAR_MOVIES_ENDPOINT } },
    );

    await waitFor(() => expect(result.current.error).not.toBeNull());

    vi.mocked(callAPI).mockResolvedValue(mockResponse);
    rerender({ endpoint: SEARCH_MOVIES_ENDPOINT });

    expect(result.current.error).toBeNull();
  });

  test("aborts the previous request when the endpoint changes", async () => {
    vi.mocked(callAPI).mockResolvedValue(mockResponse);

    const { rerender } = renderHook(
      ({ endpoint }) => useFetch<Movie[]>(endpoint),
      { initialProps: { endpoint: POPULAR_MOVIES_ENDPOINT } },
    );

    const signal = vi.mocked(callAPI).mock.calls[0][1];
    expect(signal?.aborted).toBe(false);

    rerender({ endpoint: SEARCH_MOVIES_ENDPOINT });

    expect(signal?.aborted).toBe(true);
  });

  test("ensures new value wins even if old resolves after new", async () => {
    let resolveOldReq!: (value: string) => void;
    let resolveNewReq!: (value: string) => void;

    const oldRequestPromise = new Promise<string>((resolve) => {
      resolveOldReq = resolve;
    });
    const newRequestPromise = new Promise<string>((resolve) => {
      resolveNewReq = resolve;
    });

    vi.mocked(callAPI).mockImplementation(([endpoint]) => {
      if (endpoint === "/old") return oldRequestPromise;
      if (endpoint === "/new") return newRequestPromise;
      return Promise.reject(new Error("Uknown endpoint"));
    });

    // Render hook with old endpoint
    const { result, rerender } = renderHook(
      ({ endpoint }) => useFetch<string>(endpoint),
      { initialProps: { endpoint: "/old" } },
    );

    // Change enpoint to trigger the second request while the first is pending
    rerender({ endpoint: "/new" });

    // Resolve the new first, then the old last
    resolveNewReq("NEW");
    resolveOldReq("OLD");

    // Assert that the new wins, and was not overwritten by old
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("NEW");
    });
  });
});
