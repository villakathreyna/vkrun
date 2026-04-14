# API Documentation

Complete reference for all API endpoints in the Spectrum of Strength Run registration system.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

Admin endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Get token from `/api/admin/login`

---

## Public Endpoints

### 1. Register Participant

**POST** `/register`

Register a new participant for the race.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "09123456789",
  "raceCategory": "10km"
}
```

**Response (201):**
```json
{
  "success": true,
  "registrationId": "uuid",
  "message": "Registration successful"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid email format"
}
```

---

### 2. Submit Payment

**POST** `/payment`

Submit payment proof for a registration.

**Request:**
- Content-Type: `multipart/form-data`

**Form Fields:**
- `registrationId` (string) - Registration UUID
- `amount` (number) - Payment amount in PHP
- `email` (string) - Participant email
- `file` (file) - Payment proof image

**Response (201):**
```json
{
  "success": true,
  "paymentId": "uuid",
  "message": "Payment submitted successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Missing required fields"
}
```

---

### 3. Get Payment Status

**GET** `/payment?email=user@example.com`

Get payment status for a participant.

**Response (200):**
```json
{
  "payments": [
    {
      "id": "uuid",
      "registrationId": "uuid",
      "referenceNumber": "REF-001",
      "amount": 1100,
      "status": "pending",
      "createdAt": "2026-04-14T10:30:00Z"
    }
  ]
}
```

---

## Admin Endpoints

### 1. Admin Login

**POST** `/admin/login`

Authenticate as admin user.

**Request Body:**
```json
{
  "email": "admin@villakathreyna.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "token_string",
  "user": {
    "id": "uuid",
    "email": "admin@villakathreyna.com",
    "name": "Admin Name"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 2. Get Dashboard Stats

**GET** `/admin/stats`

Get dashboard statistics and metrics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "stats": {
    "totalRegistrations": 150,
    "totalPayments": 120,
    "pendingPayments": 30,
    "verifiedPayments": 90,
    "totalRevenue": 127500
  }
}
```

---

### 3. Get Registrations

**GET** `/admin/registrations`

List all registrations.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "registrations": [
    {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "john@example.com",
      "raceCategory": "10km",
      "status": "pending",
      "createdAt": "2026-04-14T10:30:00Z"
    }
  ]
}
```

---

### 4. Get Payments for Review

**GET** `/admin/payments?status=pending`

List payments pending review.

**Query Parameters:**
- `status` (string) - Filter by status: `pending`, `verified`, `rejected`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "payments": [
    {
      "id": "uuid",
      "registrationId": "uuid",
      "email": "john@example.com",
      "referenceNumber": "GCash-12345",
      "amount": 1100,
      "proofUrl": "https://...",
      "status": "pending",
      "confidence": "high",
      "createdAt": "2026-04-14T10:30:00Z"
    }
  ]
}
```

---

### 5. Verify Payment

**POST** `/admin/payments/[id]/verify`

Approve a payment submission.

**URL Parameters:**
- `id` (string) - Payment UUID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified"
}
```

---

### 6. Reject Payment

**POST** `/admin/payments/[id]/reject`

Reject a payment submission.

**URL Parameters:**
- `id` (string) - Payment UUID

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment rejected"
}
```

---

### 7. Export Registrations CSV

**GET** `/admin/export/registrations`

Download registrations as CSV.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** CSV file attachment

---

### 8. Export Payments CSV

**GET** `/admin/export/payments`

Download payments as CSV.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** CSV file attachment

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid auth token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

No rate limiting implemented. For production, consider adding:
- 10 requests per minute for public endpoints
- 60 requests per minute for admin endpoints

---

## CORS

Public endpoints allow requests from any origin.
Admin endpoints require same-origin requests.

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "raceCategory": "10km"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@villakathreyna.com",
    "password": "password"
  }'
```

### Get Stats
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer <token>"
```

---

## Webhook Events (Future)

Planned webhook support for:
- `payment.verified` - When payment is verified
- `registration.confirmed` - When registration is confirmed
- `payment.rejected` - When payment is rejected

---

## Version History

### v1.0 (Current)
- Basic registration and payment submission
- Admin dashboard with verification
- CSV export functionality
- Payment matching system

Future versions may include:
- Email notifications
- SMS alerts
- Payment gateway integration
- Advanced analytics
