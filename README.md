# CARECONNECT – Healthcare Management Platform

**Tagline:** Connecting Care. Saving Lives.

CARECONNECT is a healthcare management portfolio project built to demonstrate role-based access, appointment management, medical records, prescriptions, blood requests and emergency request coordination.

> **Project status:** Portfolio prototype. This project is not a clinically validated or production-ready healthcare system. Use synthetic data for testing.

## Features

- Patient registration, login and dashboard
- Role-based portals and access
- Doctor dashboard and appointment management
- Appointment requests, confirmation and rejection
- Medical record management
- Prescription management
- Blood donation availability and blood requests
- Emergency assistance requests and status tracking
- Emergency coordinator dashboard
- Patient notifications and profile management
- Supabase authentication and PostgreSQL with Row Level Security

## User Roles

- Patient
- Doctor
- Hospital Administrator
- Blood Donor
- Emergency Coordinator
- Super Administrator

Some role-specific workflows may require further testing and verification.

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- Supabase JavaScript Client
- REST API health and status endpoints

### Database and Authentication
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security (RLS)

## Project Structure

```text
CARECONNECT/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── config/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── .env.example
│   ├── server.js
│   └── package.json
├── docs/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

- Node.js 18 or later (developed and tested with Node.js 26)
- npm 9 or later
- A Supabase project

## Installation

Clone the repository and enter the project directory:

```bash
git clone YOUR_REPOSITORY_URL
cd CARECONNECT
npm install
```

Create local environment files using the example templates:

**Windows PowerShell:**

```powershell
Copy-Item client/.env.example client/.env
Copy-Item server/.env.example server/.env
```

Configure the required variables in each local environment file.

### Frontend configuration

File: `client/.env`

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-public-anon-key
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend configuration

File: `server/.env`

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-public-anon-key
```

The backend configuration also supports `SUPABASE_SERVICE_ROLE_KEY`. If used, it must remain exclusively on the server and must never be exposed to the frontend or committed to version control.

The current development setup can use the public anon key. Database access must be protected by correctly configured Row Level Security policies.

## Run the Application

Start both frontend and backend from the project root:

```bash
npm run dev
```

Or start them separately:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

### Local URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API health | http://localhost:5000/api/health |
| API ping | http://localhost:5000/api/ping |

## Production Build

Build the frontend:

```bash
npm run build:client
```

Preview the production frontend:

```bash
npm run preview --workspace=client
```

Start the backend:

```bash
npm run start:server
```

## Security Considerations

- Never commit `.env` files or private credentials.
- Never expose a Supabase service-role key in frontend code.
- Keep Row Level Security enabled and review policies for every sensitive table.
- Use synthetic information during development and demonstrations.
- Configure production secrets and allowed origins separately before deployment.
- Test authorization for every user role before any real-world use.

## Documentation

Additional project documentation is maintained in the `docs/` directory:

- `ARCHITECTURE.md` – Application architecture
- `DATABASE_SCHEMA.md` – Database structure and security policies
- `API_DOCUMENTATION.md` – Backend API documentation
- `SETUP_GUIDE.md` – Development and setup instructions

## Limitations

- The Express backend currently provides health and status APIs; the frontend uses Supabase directly for application data and authentication.
- Emergency assistance is a request coordination workflow, not a live emergency dispatch service.
- Blood requests do not guarantee donor availability.
- No clinical decision-making or medical diagnosis is provided.
- Additional security, role-based testing, deployment and performance validation are required before production use.

## License

Proprietary portfolio project. CARECONNECT © 2026.
