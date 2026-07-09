import { expect, test, vi } from 'vitest'
import { callAPI } from './callAPI'

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

type Movie = {
    id: number;
    title: string;
  }

test("returns movies from API response", async () => {
    // Mock fetch
    globalThis.fetch = vi.fn();

    // Always return this value
    vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
            results: [
            { id: 1, title: "Batman" }
            ]
        })
    } as Response);

    const popularMovies = await callAPI<Movie[]>("/movie/popular");

    expect(popularMovies).toHaveLength(1);
    expect(popularMovies[0]).toStrictEqual({ id: 1, title: "Batman" })
})

test("throws error on reject", async () => {
    // Mock fetch
    globalThis.fetch = vi.fn();

    // Return failed response
    vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401
    } as Response)

    await expect(callAPI<Movie[]>("/movie/popular")).rejects.toThrow(`HTTP error! Status: 401`)
})

test("throws error on network failure", async () => {
    // Mock fetch
    globalThis.fetch = vi.fn();

    // Return error on network failure
    vi.mocked(fetch).mockRejectedValue(new Error('Network Timeout'))

    await expect(callAPI<Movie[]>("/movie/popular")).rejects.toThrow('Network Timeout')
})

test("calls fetch with the correct URL and headers", async () => {
    // 1. Mock fetch
    globalThis.fetch = vi.fn();

    // 2. Tell the mock what to return
    vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({
            results: []
        })
    } as Response);

    // 3. Call callAPI()
    await callAPI<Movie[]>("/movie/popular");

    // 4. Verify fetch was called one time
    expect(fetch).toHaveBeenCalledTimes(1);

    // 5. Verify it was called with the correct arguments
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/movie/popular`, 
        expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                Authorization: `Bearer ${TMDB_TOKEN}`,
                accept: "application/json"
        }),
    }))
})