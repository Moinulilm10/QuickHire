import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "../../src/hooks/useDebounce";

describe("useDebounce Hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should update the debounced value after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      },
    );

    // Update value
    rerender({ value: "updated", delay: 500 });

    // Value should still be initial before delay
    expect(result.current).toBe("initial");

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe("updated");
  });

  it("should reset the timer if the value changes again before the delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      },
    );

    // Initial change
    rerender({ value: "change1", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("initial");

    // Second change within the first delay
    rerender({ value: "change2", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });
    // Should still be initial because the 500ms timer restarted at 300ms
    expect(result.current).toBe("initial");

    act(() => {
      jest.advanceTimersByTime(200);
    });
    // Total 500ms from the last change
    expect(result.current).toBe("change2");
  });

  it("should cancel the timer on unmount", () => {
    const { unmount } = renderHook(() => useDebounce("value", 500));
    const spy = jest.spyOn(global, "clearTimeout");

    unmount();

    expect(spy).toHaveBeenCalled();
  });
});
