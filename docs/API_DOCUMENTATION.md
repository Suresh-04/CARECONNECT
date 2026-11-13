# CARECONNECT API Documentation

## Overview

CARECONNECT uses an Express.js backend for API health and liveness checks.

The React frontend communicates directly with Supabase for authentication and application data.

Local backend URL: http://localhost:5000

## Available Endpoints

### 1. Root Welcome Endpoint

- Method: GET
- Path: /
- Purpose: Returns API welcome information and available endpoint paths.

### 2. Detailed Health Endpoint

- Method: GET
- Path: /api/health
- Purpose: Reports backend runtime information and Supabase Auth connectivity status.

Response fields include:
- Backend status and service name
- Application version and environment
- Server uptime and timestamp
- Supabase configuration and connectivity status
- Supabase request latency
- Node.js version and platform
- Memory usage and response time

Possible Supabase status values:
- not_configured
- connected
- degraded
- unreachable

Note: This endpoint checks Supabase Auth session access. It does not execute a direct PostgreSQL query or verify every database table. The top-level status currently remains healthy when the endpoint responds, so check database.status separately.

### 3. Quick Ping Endpoint

- Method: GET
- Path: /api/ping
- Purpose: Returns a lightweight backend liveness response.

Example response:

{
  "status": "ok",
  "time": "2026-11-13T00:00:00.000Z"
}

The timestamp above is illustrative.

## CORS Configuration

The backend allows configured frontend origins, including:
- http://localhost:5173
- http://localhost:3000
- http://127.0.0.1:5173

The configured CLIENT_URL is also included.

Other origins are rejected by the CORS configuration.

## Request Configuration

- JSON request body limit: 1 MB
- URL-encoded request body limit: 1 MB
- Configured CORS methods: GET, POST, PUT, PATCH, DELETE and OPTIONS

These configured methods do not mean that application-specific endpoints exist for every method.

## Application Data Operations

The frontend currently communicates directly with Supabase for:
- Authentication and profiles
- Appointment management
- Medical records and prescriptions
- Blood donor registration and blood requests
- Emergency assistance requests
- Notifications

These workflows do not currently have dedicated Express business API endpoints.

## Running Locally

From the project root:

npm run dev:server

Test these endpoints in a browser or API client:

http://localhost:5000/
http://localhost:5000/api/health
http://localhost:5000/api/ping

## Security Notes

- Keep environment files and credentials out of Git.
- Never expose a Supabase service-role key in frontend code.
- Configure allowed frontend origins appropriately before deployment.
- A successful health response does not prove that every application feature or database policy is working.

This document describes the currently implemented backend routes. It is not a complete business API specification or a production security certification.
