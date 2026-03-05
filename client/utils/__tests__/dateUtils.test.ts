import { formatDate } from "../dateUtils";

describe("formatDate Utility", () => {
  // Mock console.error to avoid cluttering test output when testing invalid dates
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it("should format a valid ISO date string correctly", () => {
    const isoDate = "2026-03-05T07:59:30.291Z";
    const result = formatDate(isoDate);
    expect(result).toBe("Mar 5, 2026");
  });

  it("should format a valid Date object correctly", () => {
    const dateObj = new Date(2026, 2, 5); // Month is 0-indexed, so 2 is March
    const result = formatDate(dateObj);
    expect(result).toBe("Mar 5, 2026");
  });

  it("should return an empty string if dateString is null", () => {
    const result = formatDate(null);
    expect(result).toBe("");
  });

  it("should return an empty string if dateString is undefined", () => {
    const result = formatDate(undefined);
    expect(result).toBe("");
  });

  it("should return an empty string if dateString is an empty string", () => {
    const result = formatDate("");
    expect(result).toBe("");
  });

  it("should handle invalid date strings gracefully and return an empty string", () => {
    const invalidDate = "not-a-date";
    const result = formatDate(invalidDate);
    expect(result).toBe("");
    expect(console.error).toHaveBeenCalledWith(
      "Invalid date provided to formatDate:",
      invalidDate,
    );
  });

  it("should format different months correctly", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
    expect(formatDate("2026-12-31")).toBe("Dec 31, 2026");
  });
});
