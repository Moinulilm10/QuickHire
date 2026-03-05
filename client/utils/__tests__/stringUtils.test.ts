import { getInitials } from "../stringUtils";

describe("getInitials", () => {
  it("extracts the first two letters of standard words", () => {
    expect(getInitials("Quick Hire")).toBe("QH");
    expect(getInitials("Software Engineer")).toBe("SE");
  });

  it("handles single words correctly", () => {
    expect(getInitials("Google")).toBe("G");
  });

  it("skips non-alphanumeric words like ampersands", () => {
    expect(getInitials("Johnson & Johnson")).toBe("JJ");
    expect(getInitials("Barnes & Noble")).toBe("BN");
    expect(getInitials("Research + Development")).toBe("RD");
    expect(getInitials("A - Z Corp")).toBe("AZ");
  });

  it("handles extra spaces properly", () => {
    expect(getInitials("  Hello   World  ")).toBe("HW");
  });

  it("handles numbers as valid characters", () => {
    expect(getInitials("3D Printing Co")).toBe("3P");
  });

  it("falls back to C or the first character if string is empty or invalid", () => {
    expect(getInitials("")).toBe("C");
    expect(getInitials(undefined)).toBe("C");
    expect(getInitials(null)).toBe("C");
    // Just symbols string gets the first char returned as safety fallback
    expect(getInitials("& - +")).toBe("&");
  });
});
