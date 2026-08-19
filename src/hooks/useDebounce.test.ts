import { renderHook, act } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "./useDebounce";

const DELAY = 400;

const renderDebounce = (initial: string) =>
  renderHook(({ value }) => useDebounce(value, DELAY), {
    initialProps: { value: initial },
  });

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("returns the initial value immediately", () => {
    const { result } = renderDebounce("batman");

    expect(result.current).toBe("batman");
  });

  test("keeps the previous value until the delay elapses", () => {
    const { result, rerender } = renderDebounce("bat");

    rerender({ value: "batman" });
    act(() => {
      vi.advanceTimersByTime(DELAY - 1);
    });

    expect(result.current).toBe("bat");
  });

  test("returns the new value once the delay elapses", () => {
    const { result, rerender } = renderDebounce("bat");

    rerender({ value: "batman" });
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });

    expect(result.current).toBe("batman");
  });

  test("emits only the final value when the value changes rapidly", () => {
    const { result, rerender } = renderDebounce("");

    for (const value of ["b", "ba", "bat", "batm", "batma", "batman"]) {
      rerender({ value });
      act(() => {
        vi.advanceTimersByTime(DELAY - 100);
      });
      expect(result.current).toBe("");
    }

    act(() => {
      vi.advanceTimersByTime(DELAY);
    });

    expect(result.current).toBe("batman");
  });
});
