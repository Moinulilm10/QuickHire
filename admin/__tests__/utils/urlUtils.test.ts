import { getImageUrl } from "../../src/utils/urlUtils";

describe("urlUtils - getImageUrl", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns null for null, undefined, or empty path", () => {
    expect(getImageUrl(null)).toBeNull();
    expect(getImageUrl(undefined)).toBeNull();
    expect(getImageUrl("")).toBeNull();
  });

  it("returns the path as-is if it's an absolute URL", () => {
    const httpUrl = "http://example.com/logo.png";
    const httpsUrl = "https://test.com/img.jpg";
    expect(getImageUrl(httpUrl)).toBe(httpUrl);
    expect(getImageUrl(httpsUrl)).toBe(httpsUrl);
  });

  it("returns the path as-is if it's a DataURL", () => {
    const dataUrl = "data:image/png;base64,abc";
    expect(getImageUrl(dataUrl)).toBe(dataUrl);
  });

  it("resolves relative path correctly with default API URL", () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    // Default is http://localhost:5001/api -> baseUrl http://localhost:5001
    expect(getImageUrl("logo.png")).toBe("http://localhost:5001/logo.png");
    expect(getImageUrl("/uploads/file.jpg")).toBe(
      "http://localhost:5001/uploads/file.jpg",
    );
  });

  it("resolves relative path correctly with custom NEXT_PUBLIC_API_URL", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.quickhire.com/api";
    expect(getImageUrl("user.png")).toBe("https://api.quickhire.com/user.png");
  });

  it("handles complex API URLs (e.g., without trailing /api)", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.quickhire.com";
    // Reducer logic: apiUrl.replace(/\/api\/?$/, "")
    // If it doesn't end with /api, it remains same
    expect(getImageUrl("test.png")).toBe("https://api.quickhire.com/test.png");
  });
});
