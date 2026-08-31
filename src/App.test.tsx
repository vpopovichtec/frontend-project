import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router";

vi.mock("./pages/HomePage", () => ({
  HomePage: () => <p>Mock home page</p>,
}));

vi.mock("./pages/MovieDetailsPage", () => ({
  MovieDetailsPage: () => <p>Mock movie details page</p>,
}));

function renderApp(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );
}

describe("App", () => {
  test("renders the home page", () => {
    renderApp("/");

    expect(screen.getByText("Mock home page")).toBeInTheDocument();
    expect(
      screen.queryByText("Mock movie details page"),
    ).not.toBeInTheDocument();
  });

  test("renders movie details", () => {
    renderApp("/movie/123456");

    expect(screen.getByText("Mock movie details page")).toBeInTheDocument();
    expect(screen.queryByText("Mock home page")).not.toBeInTheDocument();
  });
});
