const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Category Endpoints", () => {
  let adminToken;
  let testCategory;

  beforeAll(async () => {
    // 1. Create a test admin user and login to get token
    const adminUser = await prisma.user.create({
      data: {
        email: "admin_test_categories@example.com",
        password: "hashedpassword", // Not testing auth here
        name: "Admin Tester",
        role: "ADMIN",
      },
    });

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin_test_categories@example.com",
      password: "password", // We'll bypass actual auth by mocking or assuming token works if we use a helper.
      // Actually, since authMiddleware validates JWT, we need a real token or mock.
      // Easiest is to generate a real JWT.
    });

    // For simplicity in this test file, let's just generate a token using jsonwebtoken
    const jwt = require("jsonwebtoken");
    adminToken = jwt.sign(
      { id: adminUser.id, role: adminUser.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" },
    );
  });

  afterAll(async () => {
    // Cleanup
    await prisma.job.deleteMany({
      where: { title: "Test Job for Category" },
    });
    await prisma.category.deleteMany({
      where: { name: { contains: "TestCategory" } },
    });
    await prisma.user.deleteMany({
      where: { email: "admin_test_categories@example.com" },
    });
  });

  it("should create a new category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TestCategory_Create",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("TestCategory_Create");
    testCategory = res.body.data;
  });

  it("should not create a category with duplicate name", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TestCategory_Create",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("should get all categories with pagination", async () => {
    const res = await request(app).get("/api/categories?page=1&limit=5");

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty("total");
    expect(res.body.pagination).toHaveProperty("page");
  });

  it("should get all categories with pagination and search", async () => {
    // Wait for the previous test to ensure categories exist.
    // Let's create another category just for search testing
    await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "SearchableCategoryXYZ" });

    const res = await request(app).get(
      "/api/categories?page=1&limit=5&search=XYZ",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    // Should find the one we just created
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].name).toContain("XYZ");

    // Clean up
    await prisma.category.deleteMany({
      where: { name: "SearchableCategoryXYZ" },
    });
  });

  it("should get a single category by id", async () => {
    const res = await request(app).get(`/api/categories/${testCategory.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("TestCategory_Create");
  });

  it("should update a category", async () => {
    const res = await request(app)
      .put(`/api/categories/${testCategory.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "TestCategory_Updated",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("TestCategory_Updated");
  });

  it("should delete a category", async () => {
    const res = await request(app)
      .delete(`/api/categories/${testCategory.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);

    // Verify it's gone
    const checkRes = await request(app).get(
      `/api/categories/${testCategory.id}`,
    );
    expect(checkRes.statusCode).toEqual(404);
  });
});
