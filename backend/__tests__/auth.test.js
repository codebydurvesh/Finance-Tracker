const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../testApp"); // We'll create this
const User = require("../models/User");

describe("Auth API Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    // Cleanup and close connection
    await User.deleteMany({ email: /test.*@test\.com/ });
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: `test${Date.now()}@test.com`,
          password: "password123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email");
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should fail with invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
    });

    it("should fail with duplicate email", async () => {
      const email = `duplicate${Date.now()}@test.com`;

      // First registration
      await request(app).post("/api/auth/register").send({
        name: "Test User",
        email,
        password: "password123",
      });

      // Second registration with same email
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User 2",
        email,
        password: "password456",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    let testEmail;
    const testPassword = "password123";

    beforeAll(async () => {
      // Create a user for login tests
      testEmail = `logintest${Date.now()}@test.com`;
      await request(app).post("/api/auth/register").send({
        name: "Login Test User",
        email: testEmail,
        password: testPassword,
      });
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe(testEmail);
    });

    it("should fail with incorrect password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: testEmail,
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@test.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    let authToken;
    let userId;

    beforeAll(async () => {
      // Register and login to get token
      const email = `metest${Date.now()}@test.com`;
      const registerRes = await request(app).post("/api/auth/register").send({
        name: "Me Test User",
        email,
        password: "password123",
      });

      authToken = registerRes.body.token;
      userId = registerRes.body.user._id;
    });

    it("should get user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body._id).toBe(userId);
      expect(res.body).toHaveProperty("email");
    });

    it("should fail without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken123");

      expect(res.statusCode).toBe(401);
    });
  });
});
