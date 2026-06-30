# Frontend Onboarding Project — TMDB Movie Explorer

**Audience:** junior / intern frontend engineer with some React, shaky TypeScript
**Time budget:** ~8 weeks, a couple of hours per week (~16–24 hours total)
**Stack:** Vite + React + TypeScript, shadcn/ui + Tailwind, React Router, TMDB API

---

## 1. Goal

Build a small movie-browsing single-page app on top of [The Movie Database (TMDB)](https://www.themoviedb.org/) API: browse popular movies, search, view a detail page, and keep a list of favorites that survives a page reload. It is deliberately a **narrow vertical slice**, not a full product — the point is to exercise fundamentals end to end, not to build something big.

By the end the intern should be comfortable with: typed React components, async data fetching with proper loading/error/empty states, client-side routing, persisting state, and assembling a UI from a component kit.

---

## 2. Learning objectives

**React**
- Components, props, composition
- `useState`, `useEffect`, derived state
- Rendering lists with stable `key`s
- Lifting state / sharing state across routes (Context or a tiny store)
- Writing a small custom hook (`useDebounce`)

**TypeScript** *(primary focus — this is the stated weak area)*
- Typing API response shapes (`interface Movie`, `interface MovieDetails`)
- Typing component props
- Generics (a `fetchJson<T>()` wrapper)
- Discriminated unions for async state (`idle | loading | success | error`)
- Handling nullable fields properly (TMDB returns a lot of `null`s); preferring `unknown` + narrowing over `any`

**API communication**
- Reading API docs and modeling responses
- Attaching an auth token via an `Authorization` header
- Debouncing requests, handling failures, avoiding stale-response race conditions

**UI building**
- Tailwind layout (responsive grid)
- shadcn/ui components (`Card`, `Input`, `Button`, `Skeleton`, `Badge`, `Sonner`)
- Understanding shadcn's model: you **copy components into your repo and own them**, you don't install a black-box library

---

## 3. Tech stack & setup notes

- **Vite + React + TypeScript** template (`npm create vite@latest`).
- **Tailwind + shadcn/ui** — initialize with the shadcn CLI, then pull components in as needed (`npx shadcn@latest add button card input skeleton ...`).
- **React Router** for routing.
- **Data fetching:** plain `fetch` + `useEffect` for milestones 1–6; TanStack Query introduced only as a stretch refactor (milestone 8). *See the note at the top of this hand-off if you'd rather flip that.*
- No state-management library needed — Context + `useState` is plenty at this scale.

---

## 4. Milestone 0 — Get a TMDB token (Week 1, first sitting)

1. Create a free TMDB account and request API access (Settings → API). It's free; approval is usually quick.
2. Grab the **API Read Access Token (v4 auth)** — this is a long bearer token, not the short v3 key.
3. Store it in a `.env` file as `VITE_TMDB_TOKEN`, and add `.env` to `.gitignore`.

Base setup the intern will use everywhere:
- Base URL: `https://api.themoviedb.org/3`
- Auth: send header `Authorization: Bearer <token>`
- Image URLs are **relative** in responses (`poster_path`). Build the full URL as `https://image.tmdb.org/t/p/w500<poster_path>`, and handle the case where `poster_path` is `null` with a placeholder.

> Have the intern skim the current TMDB auth + "getting started" docs themselves — reading API docs is part of the exercise, and it guards against any detail here having drifted.

**Honest caveat to discuss with them:** putting the token in the client means it's visible to anyone who opens devtools. That's fine for a learning project, but in a real product you'd proxy TMDB through a small backend so the token stays server-side. Worth a 5-minute conversation so they don't carry the wrong habit forward.

---

## 5. Scope

**In scope:** browse, search, detail page, favorites with persistence, responsive layout, loading/error/empty states.

**Out of scope:** authentication / login, user accounts, a backend, writing data back to TMDB, deployment infra. (The only "auth" is attaching the TMDB token.)

---

## 6. Milestones

Weeks are a guide, not a deadline — slippage is expected with a part-time cadence. **Milestone 6 is the cut line:** if time runs short, the project still ships as a coherent app after favorites. 7–8 are polish and depth.

### Week 1 — Project skeleton & first fetch
- App runs locally; Tailwind + shadcn initialized.
- Fetch `/movie/popular` and `console.log` the results.
- **Done when:** the app boots clean, the token works, and popular movies appear in the console with no errors.

### Week 2 — Movie grid
- `MovieCard` component (shadcn `Card`) showing poster, title, year, rating.
- Render popular movies in a responsive Tailwind grid.
- Define `interface Movie` from the real response shape; show `Skeleton` placeholders while loading.
- **Done when:** posters render in a grid that reflows on mobile/desktop, missing posters fall back gracefully, and the data is typed (no `any`).

### Week 3 — Search
- Search `Input` that queries `/search/movie?query=...`.
- A `useDebounce` custom hook so it doesn't fire on every keystroke.
- Handle the empty-query and no-results states explicitly.
- **Done when:** typing filters results smoothly, clearing the box returns to popular, and "no results" shows a real message rather than a blank screen.

### Week 4 — Routing & detail page
- Add React Router; route `/movie/:id`.
- Clicking a card opens a detail page that fetches `/movie/:id` (overview, runtime, genres, rating, backdrop).
- **Done when:** navigation works both ways, the URL is shareable, and the detail page handles its own loading/error states.

### Week 5 — Typed fetch wrapper *(the TypeScript-depth week)*
- Write a generic `fetchJson<T>(path: string): Promise<T>` that attaches the auth header in one place.
- Model async state as a **discriminated union**: `{ status: 'loading' } | { status: 'error', error } | { status: 'success', data: T }`.
- Refactor the grid, search, and detail page to go through the wrapper and render off the union.
- **Done when:** there's one place that knows about the token and base URL, and every screen renders from a typed union with the `any`s gone.

### Week 6 — Favorites *(ship line)*
- Toggle favorite from a card and the detail page.
- Persist favorites to `localStorage`; a `/favorites` route lists them.
- Share favorite state across the app (Context or a small custom hook).
- **Done when:** favorites survive a hard refresh and the same movie's favorite state is consistent everywhere it appears.

### Week 7 — Polish
- "Load more" / pagination on the grid.
- Genre `Badge`s, a toast (`Sonner`) on favorite toggle.
- Accessibility pass: keyboard navigation, alt text, focus states.
- **Done when:** it feels finished — no layout jank, usable by keyboard, no console warnings.

### Week 8 — Stretch / depth (pick one)
- **Option A:** refactor data fetching to TanStack Query; discuss what caching/dedupe/refetch buys you over the hand-rolled version.
- **Option B:** write a handful of component tests with Vitest + React Testing Library (render a card, test the favorite toggle, test the empty state).

---

## 7. Gotchas to watch for

- **Nullable fields:** `poster_path`, `backdrop_path`, `release_date`, `runtime` can all be `null`/empty. This is great TS-narrowing practice — make sure the types reflect it instead of pretending fields are always present.
- **Stale responses:** when search fires quickly, an earlier slow request can resolve *after* a later one and overwrite it. The debounce helps; the proper fix (abort/ignore stale responses) is a good week-5 discussion.
- **Rate limits:** TMDB rate-limits; debouncing search is partly about being a good citizen, not just UX.
- **shadcn mental model:** the components live in their repo and are editable — if a button looks wrong, they edit the file, they don't fight a prop API.

---

## 8. Definition of done (review checklist)

- [ ] No `any` in application code; API responses are typed
- [ ] Every data view handles loading, error, and empty states
- [ ] Layout is responsive (mobile → desktop)
- [ ] No console errors or React key warnings
- [ ] Token lives in `.env`, is read via `import.meta.env`, and is **not** committed
- [ ] `README.md` explains how to get a token and run the project
- [ ] Favorites persist across reloads
