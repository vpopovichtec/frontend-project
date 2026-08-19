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
});
