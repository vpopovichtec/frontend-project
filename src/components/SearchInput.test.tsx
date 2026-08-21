import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  test("displays the value it is given", () => {
    render(<SearchInput value="batman" onChange={() => {}} />);

    expect(screen.getByRole("textbox")).toHaveValue("batman");
  });

  test("calls onChange with the typed text", () => {
    const onChange = vi.fn();

    render(<SearchInput value="" onChange={onChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "batman" },
    });

    expect(onChange).toHaveBeenCalledWith("batman");
  });

  test("clears the value when the clear button is clicked", () => {
    const onChange = vi.fn();

    render(<SearchInput value="batman" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(onChange).toHaveBeenCalledWith("");
  });

  test("hides the clear button when the value is empty", () => {
    render(<SearchInput value="" onChange={() => {}} />);

    expect(
      screen.queryByRole("button", { name: "Clear search" }),
    ).not.toBeInTheDocument();
  });
});
