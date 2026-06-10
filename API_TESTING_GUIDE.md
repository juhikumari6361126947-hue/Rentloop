# API Testing Guide

Base URL:

```txt
http://localhost:5000/api
```

In Postman, create an environment with:

- `baseUrl` = `http://localhost:5000/api`
- `token` = user JWT
- `adminToken` = admin JWT
- `itemId` = created item id
- `requestId` = created request id

## 1. Health Check

`GET {{baseUrl}}/health`

Expected: `{ "status": "ok" }`

## 2. Signup

`POST {{baseUrl}}/auth/signup`

Body:

```json
{
  "name": "Asha Kumar",
  "email": "asha@example.com",
  "password": "Password123"
}
```

Save `token` from the response as `token`.

## 3. User Login

`POST {{baseUrl}}/auth/login`

Body:

```json
{
  "email": "asha@example.com",
  "password": "Password123"
}
```

## 4. Admin Login

`POST {{baseUrl}}/auth/admin/login`

Body:

```json
{
  "email": "admin@rentals.local",
  "password": "Admin@12345"
}
```

Use the credentials from `server/.env`. Save response token as `adminToken`.

## 5. Create Item

`POST {{baseUrl}}/items`

Authorization: Bearer `{{token}}`

Body: `form-data`

- `title`: DSLR Camera
- `description`: Canon camera with lens and bag
- `price`: 900
- `location`: Pune, Maharashtra
- `image`: choose an image file

Save returned item `_id` as `itemId`. The item starts as `pending`.

## 6. Admin View Items

`GET {{baseUrl}}/items?includePending=true`

Authorization: Bearer `{{adminToken}}`

## 7. Approve Item

`PUT {{baseUrl}}/items/{{itemId}}/status`

Authorization: Bearer `{{adminToken}}`

Body:

```json
{
  "status": "approved"
}
```

Use `"rejected"` to reject.

## 8. Browse Public Items

`GET {{baseUrl}}/items`

Optional filter:

`GET {{baseUrl}}/items?location=Pune`

## 9. Create Rental Request

Login or signup as a second user, then use their token.

`POST {{baseUrl}}/requests`

Authorization: Bearer `{{token}}`

Body:

```json
{
  "itemId": "{{itemId}}",
  "message": "I need this for the weekend."
}
```

Save returned request `_id` as `requestId`.

## 10. Owner Views Incoming Requests

`GET {{baseUrl}}/requests?type=incoming`

Authorization: Bearer owner token

## 11. Accept or Reject Request

`PUT {{baseUrl}}/requests/{{requestId}}`

Authorization: Bearer owner token

Body:

```json
{
  "status": "Accepted"
}
```

Use `"Rejected"` to reject.

## 12. Notifications

`GET {{baseUrl}}/notifications`

Authorization: Bearer `{{token}}`

Mark read:

`PUT {{baseUrl}}/notifications/{{notificationId}}/read`

## 13. Admin User Management

View users:

`GET {{baseUrl}}/admin/users`

Authorization: Bearer `{{adminToken}}`

Remove user:

`DELETE {{baseUrl}}/admin/users/{{userId}}`

Authorization: Bearer `{{adminToken}}`
