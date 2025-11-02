# 📡 Finance Tracker API Testing Guide

Complete guide for testing all API endpoints with examples.

## 🔐 Authentication Endpoints

### 1. Send OTP for Registration

**POST** `http://localhost:5000/api/auth/send-otp`

**Body (JSON):**

```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "OTP sent successfully to your email",
  "email": "john@example.com",
  "expiresIn": 600
}
```

**Error Response (429 - Rate Limited):**

```json
{
  "message": "Please wait before requesting another OTP",
  "retryAfter": 60
}
```

---

### 2. Verify OTP

**POST** `http://localhost:5000/api/auth/verify-otp`

**Body (JSON):**

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "message": "Email verified successfully",
  "verificationToken": "jwt_verification_token_here",
  "email": "john@example.com"
}
```

**Error Response (400):**

```json
{
  "message": "Invalid OTP. Please try again.",
  "attemptsLeft": 2
}
```

---

### 3. Register User

**POST** `http://localhost:5000/api/auth/register`

**Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "verificationToken": "jwt_verification_token_from_step_2"
}
```

**Success Response (201):**

```json
{
  "token": "jwt_auth_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyBudget": 0,
    "createdAt": "2025-11-02T..."
  }
}
```

---

### 4. Login User

**POST** `http://localhost:5000/api/auth/login`

**Body (JSON):**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "token": "jwt_auth_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyBudget": 0
  }
}
```

---

### 5. Google OAuth Login

**POST** `http://localhost:5000/api/auth/google`

**Body (JSON):**

```json
{
  "credential": "google_jwt_credential_from_google_signin"
}
```

**Success Response (200):**

```json
{
  "token": "jwt_auth_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@gmail.com",
    "googleId": "google_user_id",
    "profilePicture": "https://...",
    "monthlyBudget": 0
  },
  "isNewUser": true
}
```

---

### 6. Get Current User

**GET** `http://localhost:5000/api/auth/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyBudget": 5000,
    "createdAt": "2025-11-02T..."
  }
}
```

---

## 👤 User Management Endpoints

### 7. Get User Profile

**GET** `http://localhost:5000/api/users/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyBudget": 5000,
    "googleId": null,
    "profilePicture": null,
    "createdAt": "2025-11-02T..."
  }
}
```

---

### 8. Update User Profile

**PUT** `http://localhost:5000/api/users/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "name": "John Updated"
}
```

**Success Response (200):**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Updated",
    "email": "john@example.com",
    "monthlyBudget": 5000
  }
}
```

---

### 9. Update Monthly Budget

**PUT** `http://localhost:5000/api/users/budget`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "monthlyBudget": 10000
}
```

**Success Response (200):**

```json
{
  "message": "Budget updated successfully",
  "monthlyBudget": 10000
}
```

---

### 10. Change Password

**PUT** `http://localhost:5000/api/users/password`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**

```json
{
  "message": "Password changed successfully"
}
```

---

### 11. Send OTP for Email Change

**POST** `http://localhost:5000/api/users/change-email/send-otp`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "newEmail": "newemail@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "OTP sent successfully to your new email address",
  "email": "newemail@example.com"
}
```

---

### 12. Verify OTP and Update Email

**POST** `http://localhost:5000/api/users/change-email/verify-otp`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "newEmail": "newemail@example.com",
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "message": "Email updated successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "newemail@example.com",
    "monthlyBudget": 5000
  }
}
```

---

### 13. Send OTP for Account Deletion

**POST** `http://localhost:5000/api/users/delete-account/send-otp`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "message": "OTP sent successfully to your email",
  "email": "john@example.com"
}
```

---

### 14. Verify OTP and Delete Account

**POST** `http://localhost:5000/api/users/delete-account/verify-otp`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "otp": "123456"
}
```

**Success Response (200):**

```json
{
  "message": "Account deleted successfully"
}
```

---

## 💰 Transaction Endpoints

### 15. Get All Transactions

**GET** `http://localhost:5000/api/transactions?year=2025&month=11`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**

- `year` (optional) - Filter by year (default: current year)
- `month` (optional) - Filter by month 1-12 (default: current month)

**Success Response (200):**

```json
{
  "transactions": [
    {
      "_id": "transaction_id",
      "title": "Salary",
      "amount": 50000,
      "type": "income",
      "category": "Salary",
      "date": "2025-11-01T00:00:00.000Z",
      "user": "user_id",
      "createdAt": "2025-11-01T..."
    },
    {
      "_id": "transaction_id_2",
      "title": "Groceries",
      "amount": 5000,
      "type": "expense",
      "category": "Food",
      "date": "2025-11-02T00:00:00.000Z",
      "user": "user_id",
      "createdAt": "2025-11-02T..."
    }
  ]
}
```

---

### 16. Get Financial Summary

**GET** `http://localhost:5000/api/transactions/summary?year=2025&month=11`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**

- `year` (optional) - Filter by year
- `month` (optional) - Filter by month 1-12

**Success Response (200):**

```json
{
  "totalIncome": 50000,
  "totalExpense": 15000,
  "netBalance": 35000,
  "transactionCount": 25
}
```

---

### 17. Create Transaction

**POST** `http://localhost:5000/api/transactions`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "title": "Freelance Project",
  "amount": 25000,
  "type": "income",
  "category": "Freelance",
  "date": "2025-11-02"
}
```

**Success Response (201):**

```json
{
  "transaction": {
    "_id": "new_transaction_id",
    "title": "Freelance Project",
    "amount": 25000,
    "type": "income",
    "category": "Freelance",
    "date": "2025-11-02T00:00:00.000Z",
    "user": "user_id",
    "createdAt": "2025-11-02T..."
  }
}
```

---

### 18. Update Transaction

**PUT** `http://localhost:5000/api/transactions/:id`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Body (JSON):**

```json
{
  "title": "Updated Freelance Project",
  "amount": 30000,
  "category": "Freelance Work"
}
```

**Success Response (200):**

```json
{
  "transaction": {
    "_id": "transaction_id",
    "title": "Updated Freelance Project",
    "amount": 30000,
    "type": "income",
    "category": "Freelance Work",
    "date": "2025-11-02T00:00:00.000Z",
    "user": "user_id"
  }
}
```

---

### 19. Delete Transaction

**DELETE** `http://localhost:5000/api/transactions/:id`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "message": "Transaction deleted successfully",
  "_id": "deleted_transaction_id"
}
```

---

## 🧪 Testing with cURL

### Send OTP

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com"}'
```

### Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","otp":"123456"}'
```

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","verificationToken":"jwt_token_here"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Transactions (with auth)

```bash
curl -X GET "http://localhost:5000/api/transactions?year=2025&month=11" \
  -H "Authorization: Bearer your_jwt_token_here"
```

### Create Transaction

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token_here" \
  -d '{"title":"Salary","amount":50000,"type":"income","category":"Salary","date":"2025-11-01"}'
```

---

## 🧪 Testing with Postman

1. **Import Collection**

   - Create a new collection "Finance Tracker"
   - Add all endpoints from above

2. **Set Environment Variables**

   - `base_url`: `http://localhost:5000`
   - `token`: Your JWT token (update after login)

3. **Authorization Setup**

   - Type: Bearer Token
   - Token: `{{token}}`

4. **Test Flow**
   1. Send OTP → Get OTP from email
   2. Verify OTP → Get verification token
   3. Register → Get auth token
   4. Login → Get auth token
   5. Use token for all protected routes

---

## ❌ Common Error Responses

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "message": "Not authorized, token failed"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 429 Too Many Requests

```json
{
  "message": "Please wait before requesting another OTP",
  "retryAfter": 60
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error message",
  "stack": "Error stack (development only)"
}
```

---

## 📝 Notes

- All dates are in ISO 8601 format
- Amounts are in the smallest currency unit (e.g., paise for INR)
- OTP expires in 10 minutes
- JWT tokens expire in 30 days
- Maximum 3 OTP verification attempts
- 60-second cooldown between OTP requests

---

**© 2025-26 Finance Tracker API Testing Guide**

### Get User (replace TOKEN with actual token):

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## Testing with PowerShell

### Register:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -ContentType "application/json" -Body '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"john@example.com","password":"password123"}'
```

### Get User:

```powershell
$token = "your_jwt_token_here"
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers @{ "Authorization" = "Bearer $token" }
```

---

## Transaction Endpoints

### 4. Create Transaction

**POST** `http://localhost:5000/api/transactions`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "title": "Salary",
  "amount": 5000,
  "type": "income",
  "category": "Job",
  "date": "2025-10-29"
}
```

**Success Response (201):**

```json
{
  "_id": "transaction_id",
  "user": "user_id",
  "title": "Salary",
  "amount": 5000,
  "type": "income",
  "category": "Job",
  "date": "2025-10-29T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 5. Get All Transactions

**GET** `http://localhost:5000/api/transactions`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
[
  {
    "_id": "transaction_id",
    "title": "Salary",
    "amount": 5000,
    "type": "income",
    "category": "Job",
    "date": "2025-10-29T00:00:00.000Z"
  }
]
```

---

### 6. Get Transactions by Month

**GET** `http://localhost:5000/api/transactions/month/:year/:month`

Example: `http://localhost:5000/api/transactions/month/2025/10`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

---

### 7. Get Transaction Summary

**GET** `http://localhost:5000/api/transactions/summary`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "totalIncome": 20000,
  "totalExpense": 10000,
  "netBalance": 10000
}
```

---

### 8. Update Transaction

**PUT** `http://localhost:5000/api/transactions/:id`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "title": "Updated Title",
  "amount": 6000
}
```

---

### 9. Delete Transaction

**DELETE** `http://localhost:5000/api/transactions/:id`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "id": "transaction_id",
  "message": "Transaction deleted"
}
```

---

## PowerShell Testing Examples

### Create Transaction:

```powershell
$token = "your_jwt_token_here"
$body = @{
    title = "Grocery Shopping"
    amount = 150
    type = "expense"
    category = "Food"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/transactions" -Method Post -Headers @{ "Authorization" = "Bearer $token" } -ContentType "application/json" -Body $body
```

### Get All Transactions:

```powershell
$token = "your_jwt_token_here"
Invoke-RestMethod -Uri "http://localhost:5000/api/transactions" -Method Get -Headers @{ "Authorization" = "Bearer $token" }
```

### Get Summary:

```powershell
$token = "your_jwt_token_here"
Invoke-RestMethod -Uri "http://localhost:5000/api/transactions/summary" -Method Get -Headers @{ "Authorization" = "Bearer $token" }
```

---

## User Settings Endpoints

### 10. Get User Profile

**GET** `http://localhost:5000/api/users/me`

**Headers:**
`Authorization: Bearer <your_jwt_token>`

**Success Response (200):**
`json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "monthlyBudget": 10000,
  "createdAt": "2025-10-29T..."
}
`

---

### 11. Update User Profile

**PUT** `http://localhost:5000/api/users/me`

**Headers:**
`Authorization: Bearer <your_jwt_token>
Content-Type: application/json`

**Body (JSON):**
`json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
`

---

### 12. Update Monthly Budget

**PUT** `http://localhost:5000/api/users/budget`

**Headers:**
`Authorization: Bearer <your_jwt_token>
Content-Type: application/json`

**Body (JSON):**
`json
{
  "monthlyBudget": 15000
}
`

**Success Response (200):**
`json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "monthlyBudget": 15000
}
`

**PowerShell Example:**
`powershell
$token = "your_jwt_token_here"
$body = @{ monthlyBudget = 15000 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/users/budget" -Method Put -Headers @{ "Authorization" = "Bearer $token" } -ContentType "application/json" -Body $body
`
