import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router";

vi.mock("./pages/HomePage", () => ({
  HomePage: () => <p>Mock home page</p>,
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
    expect(screen.queryByText("details")).not.toBeInTheDocument();
  });

  test("renders movie details", () => {
    renderApp("/movie/123456");

    expect(screen.getByText("detail")).toBeInTheDocument();
    expect(screen.queryByText("Mock home page")).not.toBeInTheDocument();
  });
});
