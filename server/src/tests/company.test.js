const request = require("supertest");
const app = require("../app");
const prisma = require("../config/prisma");

describe("Company API endpoints", () => {
  let createdCompanyId;

  // Cleanup after all tests
  afterAll(async () => {
    // Delete the test company if it exists
    if (createdCompanyId) {
      await prisma.company.deleteMany({
        where: { id: createdCompanyId },
      });
    }
    await prisma.$disconnect();
  });

  describe("POST /api/companies", () => {
    it("should create a new company", async () => {
      const companyData = {
        name: "Test Company Flow",
        location: "Test Location",
        logo: "https://example.com/logo.png",
      };

      const response = await request(app)
        .post("/api/companies")
        .send(companyData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.name).toBe(companyData.name);

      createdCompanyId = response.body.data.id;
    });
  });

  describe("GET /api/companies", () => {
    it("should fetch all companies with pagination", async () => {
      const response = await request(app).get("/api/companies?page=1&limit=5");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.pagination).toHaveProperty("total");
    });
  });

  describe("GET /api/companies/:id", () => {
    it("should fetch a specific company by ID", async () => {
      const response = await request(app).get(
        `/api/companies/${createdCompanyId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Company Flow");
    });

    it("should return 404 for non-existent company", async () => {
      const response = await request(app).get("/api/companies/99999");
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/companies/:id", () => {
    it("should update a specific company", async () => {
      const updatedData = {
        name: "Test Company Flow Updated",
      };

      const response = await request(app)
        .put(`/api/companies/${createdCompanyId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedData.name);
    });
  });

  describe("DELETE /api/companies/:id", () => {
    it("should delete a specific company", async () => {
      const response = await request(app).delete(
        `/api/companies/${createdCompanyId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify deletion
      const checkResponse = await request(app).get(
        `/api/companies/${createdCompanyId}`,
      );
      expect(checkResponse.status).toBe(404);

      // Prevent afterAll from failing by clearing the id
      createdCompanyId = null;
    });
  });
});
