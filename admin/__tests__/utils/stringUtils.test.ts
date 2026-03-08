import { getInitials } from "../../src/utils/stringUtils";

describe("stringUtils - getInitials", () => {
  it("returns 'C' for null, undefined, or empty string", () => {
    expect(getInitials(null)).toBe("C");
    expect(getInitials(undefined)).toBe("C");
    expect(getInitials("")).toBe("C");
  });

  it("returns the first letter of a single word", () => {
    expect(getInitials("John")).toBe("J");
    expect(getInitials("admin")).toBe("A");
  });

  it("returns the first letters of the first two words", () => {
    expect(getInitials("John Doe")).toBe("JD");
    expect(getInitials("Software Engineer Intern")).toBe("SE");
  });

  it("handles extra whitespace correctly", () => {
    expect(getInitials("  John   Doe  ")).toBe("JD");
  });

  it("handles strings with numbers", () => {
    expect(getInitials("123 Main St")).toBe("1M");
  });

  it("skips invalid words (only special characters) and uses the next valid one", () => {
    expect(getInitials("!!! John Doe")).toBe("JD");
  });

  it("falls back to the first character if no valid alphanumeric words are found", () => {
    // If "!!!" and "@@@" are processed, the loop ends with initials.length === 0
    // It should return the first char of the title.
    expect(getInitials("!!! @@@")).toBe("!");
  });

  it("extracts initials from words containing mixed characters", () => {
    expect(getInitials("(Tech) Corp")).toBe("TC");
  });
});
