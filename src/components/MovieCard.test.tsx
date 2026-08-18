import { test, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { MovieCard } from "./MovieCard";
import { mockResponse } from "@/test/mockResponse";
import { resolvePosterPath } from "@/helpers/resolvePosterPath";

describe("MovieCard", () => {
  test("renders movie information", () => {
    render(<MovieCard {...mockResponse.results[0]} />);

    expect(screen.getByText("Batman")).toBeInTheDocument();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText(8.5)).toBeInTheDocument();
  });

  test("renders poster image", () => {
    render(<MovieCard {...mockResponse.results[0]} />);
    screen.debug();

    const image = screen.getByRole("img", {
      name: mockResponse.results[0].original_title,
    });

    expect(image).toHaveAttribute(
      "src",
      resolvePosterPath(mockResponse.results[0].poster_path),
    );
  });
});
