const assert = require("assert");

/**
 * Auth Controller Unit Tests
 * Uses Node.js built-in assert module
 * Tests edge cases for both native and Google OAuth authentication
 */

// Mock response object factory
const createMockRes = () => {
  let _statusCode = 200;
  let _jsonBody = null;
  return {
    status(code) {
      _statusCode = code;
      return this;
    },
    json(data) {
      _jsonBody = data;
      return { statusCode: _statusCode, jsonBody: _jsonBody };
    },
  };
};

async function runTests() {
  console.log("\n🧪 Running Auth Controller Tests...\n");

  const authController = require("../controllers/auth.controller");

  // ─── Test 1: Controller exports exist ───
  console.log("  [1] Verifying controller exports...");
  assert.ok(
    typeof authController.signup === "function",
    "signup should be a function",
  );
  assert.ok(
    typeof authController.login === "function",
    "login should be a function",
  );
  assert.ok(
    typeof authController.googleAuth === "function",
    "googleAuth should be a function",
  );
  assert.ok(
    typeof authController.getProfile === "function",
    "getProfile should be a function",
  );
  console.log("  ✅ All controller methods exported correctly\n");

  // ─── Test 2: Signup rejects empty body ───
  console.log("  [2] Signup: missing email/password → 400...");
  const res2 = await authController.signup({ body: {} }, createMockRes());
  assert.strictEqual(
    res2.statusCode,
    400,
    "Should return 400 for missing fields",
  );
  assert.strictEqual(res2.jsonBody.success, false);
  console.log("  ✅ Signup correctly rejects empty body\n");

  // ─── Test 3: Signup rejects missing password ───
  console.log("  [3] Signup: missing password → 400...");
  const res3 = await authController.signup(
    { body: { email: "test@test.com" } },
    createMockRes(),
  );
  assert.strictEqual(res3.statusCode, 400);
  console.log("  ✅ Signup correctly rejects missing password\n");

  // ─── Test 4: Login rejects empty body ───
  console.log("  [4] Login: missing email/password → 400...");
  const res4 = await authController.login({ body: {} }, createMockRes());
  assert.strictEqual(res4.statusCode, 400);
  assert.strictEqual(res4.jsonBody.success, false);
  console.log("  ✅ Login correctly rejects empty body\n");

  // ─── Test 5: Login rejects missing password ───
  console.log("  [5] Login: missing password → 400...");
  const res5 = await authController.login(
    { body: { email: "test@test.com" } },
    createMockRes(),
  );
  assert.strictEqual(res5.statusCode, 400);
  console.log("  ✅ Login correctly rejects missing password\n");

  // ─── Test 6: Google Auth rejects empty body ───
  console.log("  [6] Google Auth: missing token/intent → 400...");
  const res6 = await authController.googleAuth({ body: {} }, createMockRes());
  assert.strictEqual(res6.statusCode, 400);
  assert.strictEqual(res6.jsonBody.success, false);
  assert.ok(
    res6.jsonBody.message.includes("token"),
    "Error message should mention token",
  );
  console.log("  ✅ Google Auth correctly rejects empty body\n");

  // ─── Test 7: Google Auth rejects missing intent ───
  console.log("  [7] Google Auth: missing intent → 400...");
  const res7 = await authController.googleAuth(
    { body: { token: "fake_token" } },
    createMockRes(),
  );
  assert.strictEqual(res7.statusCode, 400);
  console.log("  ✅ Google Auth correctly rejects missing intent\n");

  // ─── Test 8: Google Auth rejects missing token ───
  console.log("  [8] Google Auth: missing token → 400...");
  const res8 = await authController.googleAuth(
    { body: { intent: "login" } },
    createMockRes(),
  );
  assert.strictEqual(res8.statusCode, 400);
  console.log("  ✅ Google Auth correctly rejects missing token\n");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🎉 All 8 tests passed successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

runTests().catch((err) => {
  console.error("\n❌ Test failed:", err.message);
  process.exit(1);
});
