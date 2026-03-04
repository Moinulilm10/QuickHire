const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Job API Endpoints", () => {
  let adminToken;
  let testCompanyId;
  let testJobId;

  beforeAll(async () => {
    // Cleanup and setup
    await prisma.jobApplication.deleteMany();
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();

    // Create a test company
    const company = await prisma.company.create({
      data: {
        name: "Test Company",
        location: "Test Location",
      },
    });
    testCompanyId = company.id;

    // Login to get token
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@quickhire.com",
      password: "adminquickhire",
    });

    if (!res.body.success) {
      console.error("Login failed:", res.body);
    }
    adminToken = res.body.token;
  });

  it("should create a new job with company name", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Software Engineer",
        company: "New Test Company",
        location: "Remote",
        type: "Full-Time",
        description: "Great job",
        salary: "$100k - $120k",
        experience: "3+ years",
        categories: ["IT", "Software"],
      });

    if (res.statusCode !== 201) {
      console.error("Create Job failed:", res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Software Engineer");
    testJobId = res.body.data.id;
  });

  it("should get all jobs with pagination", async () => {
    const res = await request(app).get("/api/jobs?page=1&limit=10");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.jobs)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it("should get a single job by id", async () => {
    const res = await request(app).get(`/api/jobs/${testJobId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(testJobId);
    expect(res.body.data.experience).toBe("3+ years");
  });

  it("should update a job", async () => {
    const res = await request(app)
      .put(`/api/jobs/${testJobId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Senior Software Engineer",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Senior Software Engineer");
  });

  it("should delete a job", async () => {
    const res = await request(app)
      .delete(`/api/jobs/${testJobId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
