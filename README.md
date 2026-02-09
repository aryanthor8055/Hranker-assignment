# Role-based auth (Hranker assignment)

Login (common entry) → redirects to User Dashboard or Admin Dashboard based on role.  
Register creates only non-admin users; admins are added via the database.

## Run

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:3000.

### Create an admin user (MongoDB)

Admins are not created via the Register page. To test admin login, add one in the DB.

Option 1 – MongoDB Compass / Atlas UI:  
Create a document in the `users` collection with:

- `email`: your choice  
- `password`: use a bcrypt hash (e.g. for password `admin123` you can generate hash online or use the script below)  
- `role`: `"admin"`

Option 2 – Seed script (run once from backend folder):

```bash
cd backend
node scripts/seedAdmin.js
```

Script will prompt for email/password and create one admin user.

**Admin credentials (for testing):**
- Email: `Admin@gmail.com`
- Password: `Admin123`

## Pages

- **Login** – Email/password; redirects to `/dashboard` (user) or `/admin` (admin).
- **Register** – New users only (role forced to `user`).
- **User Dashboard** – `/dashboard` (protected, user role).
- **Admin Dashboard** – `/admin` (protected, admin role).

## Deploy backend on Render

1. Go to [render.com](https://render.com), sign in, and click **New +** → **Web Service**.
2. Connect your GitHub account and select the repo `Hranker-assignment`.
3. Configure the service:
   - **Name:** e.g. `hranker-auth-api`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Under **Environment**, add:
   - `MONGO_URI` = your MongoDB Atlas connection string (e.g. `mongodb+srv://...`)
   - `JWT_SECRET` = a long random string for signing tokens  
   (Render sets `PORT` automatically; the app already uses `process.env.PORT || 5000`.)
5. Click **Create Web Service**. After the first deploy you’ll get a URL like `https://hranker-auth-api.onrender.com`.
6. Use that base URL as your API base in the frontend (e.g. `NEXT_PUBLIC_API_URL=https://hranker-auth-api.onrender.com` and call `${API_URL}/api/auth/...`).

## API (backend)

- `POST /api/auth/register` – body: `{ email, password }` → creates user (role `user`).
- `POST /api/auth/login` – body: `{ email, password }` → returns `{ token, role, ... }`.
- `GET /api/auth/me` – header `Authorization: Bearer <token>` → current user.
- `GET /api/auth/dashboard/user` – user-only dashboard data.
- `GET /api/auth/dashboard/admin` – admin-only dashboard data.
