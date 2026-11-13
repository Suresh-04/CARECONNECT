
# CARECONNECT Setup & Developer Guide

## Prerequisites

- Node.js 20.19+ or 22.12+ (Node.js 26.13.0 tested)
- npm
- An active Supabase account and project
- Git (recommended)

## 1. Install Dependencies

From the repository root:

```powershell
npm install
```

This installs dependencies for the root project and its client/server workspaces.

## 2. Configure Environment Variables

### Backend

Copy the example file:

```powershell
Copy-Item server/.env.example server/.env
```

Configure `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

The service-role key is optional for the current backend configuration. Never expose it in frontend code or commit it to Git.

### Frontend

Copy the example file:

```powershell
Copy-Item client/.env.example client/.env
```

Configure `client/.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:5000/api
```

Replace example values with your own Supabase project settings. Never commit actual `.env` files.

## 3. Launch Development Servers

Run both services:

```powershell
npm run dev
```

Or use separate terminals:

Backend:

```powershell
npm run dev:server
```

Frontend:

```powershell
npm run dev:client
```

Local addresses:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 4. Verify the Application

Open http://localhost:5173

Backend endpoints:

- http://localhost:5000/
- http://localhost:5000/api/health
- http://localhost:5000/api/ping

A successful health response does not guarantee every database policy or application workflow is working.

## 5. Production Build

Build the frontend:

```powershell
npm run build:client
```

Preview the production build:

```powershell
npm run preview --workspace=client
```

## 6. Start the Backend

```powershell
npm run start:server
```

## 7. Project Structure

- `client/` - React and Vite frontend
- `server/` - Express backend
- `docs/` - Project documentation
- `package.json` - Root npm workspace configuration
- `package-lock.json` - Dependency lockfile

## 8. Security Reminders

- Keep `.env` files out of Git.
- Never place service-role credentials in frontend environment variables.
- Review Supabase Row Level Security policies before deployment.
- Use synthetic data for development and demonstrations.
- Verify role permissions using separate test accounts.
- Configure production CORS origins before deployment.

## Notes

CARECONNECT currently uses Supabase directly from the frontend for authentication and application data operations. The Express backend provides health and liveness endpoints.

Additional security, deployment and functional testing are required before production use.
