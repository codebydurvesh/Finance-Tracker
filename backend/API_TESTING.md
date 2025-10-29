# Finance Tracker API Testing

## Authentication Endpoints

### 1. Register User

**POST** `http://localhost:5000/api/auth/register`

**Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "monthlyBudget": 0,
  "token": "jwt_token_here"
}
```

---

### 2. Login User

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
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "monthlyBudget": 0,
  "token": "jwt_token_here"
}
```

---

### 3. Get Current User

**GET** `http://localhost:5000/api/auth/me`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**

```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "monthlyBudget": 0
}
```

---

## Testing with cURL

### Register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

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
