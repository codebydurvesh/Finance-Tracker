# Auth API Testing

## Endpoints

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
