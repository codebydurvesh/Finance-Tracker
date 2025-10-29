const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../testApp");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

describe("Transaction API Tests", () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    // Register a test user
    const email = `transtest${Date.now()}@test.com`;
    const res = await request(app).post("/api/auth/register").send({
      name: "Transaction Test User",
      email,
      password: "password123",
    });

    authToken = res.body.token;
    userId = res.body.user._id;
  });

  afterAll(async () => {
    // Cleanup
    await Transaction.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    await mongoose.connection.close();
  });

  describe("POST /api/transactions", () => {
    it("should create a new transaction", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Income",
          amount: 1000,
          type: "income",
          category: "Salary",
          date: new Date(),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("Test Income");
      expect(res.body.amount).toBe(1000);
      expect(res.body.type).toBe("income");
    });

    it("should fail without authentication", async () => {
      const res = await request(app).post("/api/transactions").send({
        title: "Test Income",
        amount: 1000,
        type: "income",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should fail with invalid amount", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Income",
          amount: -100,
          type: "income",
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /api/transactions", () => {
    beforeAll(async () => {
      // Create some test transactions
      await Transaction.create([
        {
          user: userId,
          title: "Salary",
          amount: 5000,
          type: "income",
          date: new Date(),
        },
        {
          user: userId,
          title: "Grocery",
          amount: 500,
          type: "expense",
          date: new Date(),
        },
      ]);
    });

    it("should get all transactions for user", async () => {
      const res = await request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should fail without authentication", async () => {
      const res = await request(app).get("/api/transactions");

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/transactions/summary", () => {
    it("should get transaction summary", async () => {
      const res = await request(app)
        .get("/api/transactions/summary")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("totalIncome");
      expect(res.body).toHaveProperty("totalExpense");
      expect(res.body).toHaveProperty("netBalance");
      expect(typeof res.body.totalIncome).toBe("number");
    });
  });

  describe("PUT /api/transactions/:id", () => {
    let transactionId;

    beforeAll(async () => {
      // Create a transaction to update
      const transaction = await Transaction.create({
        user: userId,
        title: "To Update",
        amount: 100,
        type: "expense",
        date: new Date(),
      });
      transactionId = transaction._id;
    });

    it("should update transaction", async () => {
      const res = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Updated Transaction",
          amount: 200,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Transaction");
      expect(res.body.amount).toBe(200);
    });

    it("should fail to update another user's transaction", async () => {
      // Create another user
      const otherEmail = `other${Date.now()}@test.com`;
      const otherRes = await request(app).post("/api/auth/register").send({
        name: "Other User",
        email: otherEmail,
        password: "password123",
      });

      const res = await request(app)
        .put(`/api/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${otherRes.body.token}`)
        .send({
          title: "Hacked",
        });

      expect(res.statusCode).toBe(404);

      // Cleanup
      await User.findByIdAndDelete(otherRes.body.user._id);
    });
  });

  describe("DELETE /api/transactions/:id", () => {
    let transactionId;

    beforeAll(async () => {
      // Create a transaction to delete
      const transaction = await Transaction.create({
        user: userId,
        title: "To Delete",
        amount: 50,
        type: "expense",
        date: new Date(),
      });
      transactionId = transaction._id;
    });

    it("should delete transaction", async () => {
      const res = await request(app)
        .delete(`/api/transactions/${transactionId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("deleted");

      // Verify deletion
      const transaction = await Transaction.findById(transactionId);
      expect(transaction).toBeNull();
    });
  });
});
