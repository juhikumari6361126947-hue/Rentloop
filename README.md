# Rental Marketplace

A full-stack rental marketplace where people can list unused items, receive rental requests, approve or reject them, and earn from daily rentals. The app uses React, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, Cloudinary uploads, and optional Nodemailer email notifications.

## Project Structure

```txt
client/   React + Tailwind frontend
server/   Express + MongoDB backend
```

## Features

- Guest browsing with location filtering and item details
- User signup/login with JWT and bcrypt password hashing
- User dashboard for profile, listings, incoming requests, outgoing requests and notifications
- Image upload to Cloudinary
- Admin login with separate credentials
- Admin dashboard for users, items, item approval/rejection/deletion and user removal
- Owner-only request acceptance/rejection
- In-app notifications and optional email notifications
- Responsive UI with loading and error states

## Setup

1. Install dependencies:

```bash
cd server
npm install
cd ../client
npm install
```

2. Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

On macOS/Linux use `cp` instead of `copy`.

3. Configure `server/.env`:

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: a long random string
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: admin login credentials
- Cloudinary credentials for image uploads
- Optional SMTP settings for email notifications

4. Run MongoDB locally or use MongoDB Atlas.

5. Start the backend:

```bash
cd server
npm run dev
```

6. Start the frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`.

## Main API Routes

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`

Items:

- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `DELETE /api/items/:id`
- `PUT /api/items/:id/status`

Requests:

- `POST /api/requests`
- `GET /api/requests`
- `PUT /api/requests/:id`

Admin:

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`

Notifications:

- `GET /api/notifications`
- `PUT /api/notifications/:id/read`

## Notes

New item listings default to `pending`. Admins must approve them before they appear publicly. Email notifications are skipped automatically if SMTP settings are not configured.
