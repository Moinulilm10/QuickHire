const request = require("supertest");
const express = require("express");
const authRoutes = require("../src/routes/auth.routes");
const prisma = require("../src/config/prisma");

// Create a mock app for testing
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Endpoints", () => {
  let testUser = {
    email: "testuser@example.com",
    password: "password123",
    name: "Test User",
  };

  // Clean up before and after tests
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  describe("POST /api/auth/signup", () => {
    it("should successfully sign up a new user", async () => {
      const res = await request(app).post("/api/auth/signup").send(testUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail to sign up with an existing email", async () => {
      const res = await request(app).post("/api/auth/signup").send(testUser);

      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("already exists");
    });

    it("should fail to sign up with missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "invalid@example.com" });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should successfully log in with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/profile", () => {
    it("should fail to access profile without a token", async () => {
      const res = await request(app).get("/api/auth/profile");
      expect(res.statusCode).toEqual(401);
    });

    it("should successfully retrieve profile with valid token", async () => {
      // First login to get a token
      const loginRes = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      const token = loginRes.body.token;

      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user.email).toBe(testUser.email);
    });
  });
});
