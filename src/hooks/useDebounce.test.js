import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("fires once after 600ms when typing every 100ms (5 keystrokes)", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 600),
      { initialProps: { value: "" } },
    );

    const values = ["h", "he", "hel", "hell", "hello"];

    values.forEach((value, index) => {
      rerender({ value });
      act(() => {
        jest.advanceTimersByTime(100);
      });
      if (index < values.length - 1) {
        expect(result.current).toBe("");
      }
    });

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(result.current).toBe("hello");
  });

  it("waits for the full debounce window after the last keystroke", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 600),
      { initialProps: { value: "" } },
    );

    rerender({ value: "abc" });

    act(() => {
      jest.advanceTimersByTime(599);
    });
    expect(result.current).toBe("");

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe("abc");
  });
});
