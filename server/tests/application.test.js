const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Application API Endpoints", () => {
  let adminToken;
  let userToken;
  let testUserId;
  let testCompanyId;
  let testJobId;
  let applicationId;

  beforeAll(async () => {
    // Basic cleanup
    await prisma.jobApplication.deleteMany();
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();

    // Test users are created during global seeding/auth tests usually,
    // but for self-containment we sign up a user or assume admin exists from db push

    // Login as admin
    const adminRes = await request(app).post("/api/auth/login").send({
      email: "admin@quickhire.com",
      password: "adminquickhire",
    });
    adminToken = adminRes.body.token;

    // Login or Register a normal user
    let userRes = await request(app).post("/api/auth/login").send({
      email: "testuser@quickhire.com",
      password: "password123",
    });

    if (!userRes.body.success) {
      userRes = await request(app).post("/api/auth/signup").send({
        name: "Test User",
        email: "testuser@quickhire.com",
        password: "password123",
        role: "CANDIDATE",
      });
      // sign up doesn't return token in this implementation, so we login again
      userRes = await request(app).post("/api/auth/login").send({
        email: "testuser@quickhire.com",
        password: "password123",
      });
    }

    userToken = userRes.body.token;
    testUserId = userRes.body.user.id;

    // Create a test company
    const company = await prisma.company.create({
      data: {
        name: "Application Test Company",
        location: "Test Location",
      },
    });
    testCompanyId = company.id;

    // Create a test job
    const job = await prisma.job.create({
      data: {
        title: "Test Application Job",
        companyId: testCompanyId,
        location: "Remote",
        type: "Full-Time",
        description: "Great application job",
        salary: "$100k - $120k",
        experience: "3+ years",
      },
    });
    testJobId = job.id;
  });

  afterAll(async () => {
    await prisma.jobApplication.deleteMany();
    await prisma.job.deleteMany({ where: { id: testJobId } });
    await prisma.company.deleteMany({ where: { id: testCompanyId } });
  });

  it("should create a new job application", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${userToken}`)
      .field("jobId", testJobId)
      .field("companyId", testCompanyId)
      .field("coverLetter", "I am a great fit");

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.coverLetter).toBe("I am a great fit");
    applicationId = res.body.data.id;
  });

  it("should prevent duplicate applications", async () => {
    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${userToken}`)
      .field("jobId", testJobId)
      .field("companyId", testCompanyId);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("already applied");
  });

  it("should fetch my applications", async () => {
    const res = await request(app)
      .get("/api/applications/my")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].id).toBe(applicationId);
  });

  it("should allow admin to get all applications", async () => {
    const res = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe("PENDING");
  });

  it("should not allow non-admin to get all applications", async () => {
    const res = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403); // Assuming 403 for Forbidden
  });

  it("should allow admin to update application status", async () => {
    const res = await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "ACCEPTED" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ACCEPTED");
  });

  it("should allow admin to delete an application", async () => {
    const res = await request(app)
      .delete(`/api/applications/${applicationId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify deletion
    const getRes = await request(app)
      .get("/api/applications")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(getRes.body.data.length).toBe(0);
  });
});
