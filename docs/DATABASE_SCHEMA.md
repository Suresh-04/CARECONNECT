# CARECONNECT Database Schema

## Overview

CARECONNECT uses Supabase PostgreSQL for application data and Supabase Auth for user authentication.

The frontend source currently references the following eight database tables:

| Table | Application purpose |
|---|---|
| `profiles` | User profiles and role information |
| `appointments` | Patient appointment requests and doctor actions |
| `blood_donors` | Blood donor registration and availability |
| `blood_requests` | Patient blood requests and request history |
| `emergency_requests` | Emergency assistance requests and coordination |
| `medical_records` | Patient medical records |
| `prescriptions` | Doctor-created prescriptions |
| `notifications` | User notifications |

This inventory is based on frontend source references. It is not a complete export of the live database schema.

## User Roles

The application defines these roles:

- `patient`
- `doctor`
- `hospital_admin`
- `blood_donor`
- `emergency_coordinator`
- `super_admin`

Role availability in the application does not necessarily mean every role workflow has been fully tested.

## Authentication and Access Control

- Supabase Auth manages user authentication.
- The application uses the authenticated user's profile to determine role-based access.
- PostgreSQL Row Level Security (RLS) should protect sensitive application tables.
- Policies should restrict access according to the authenticated user's identity and authorized role.
- Doctor appointment and record access must respect doctor verification status.
- Administrative access should be restricted to explicitly authorized users.

## Data Relationships

The application uses profiles to associate authenticated users with their application roles.

Appointments, medical records, prescriptions, blood requests, donor registrations, emergency requests and notifications are stored in their respective tables.

Refer to the actual Supabase database definitions for exact foreign keys, column types, constraints, indexes and relationships.

## Important Security Notes

- Keep RLS enabled on tables containing user or healthcare-related information.
- Review SELECT, INSERT, UPDATE and DELETE policies individually.
- Do not rely only on frontend role checks for data security.
- Never expose a Supabase service-role key in client-side code.
- Use synthetic information during development and demonstrations.

## Schema Verification

Before applying database migrations or changing policies:

1. Inspect the current Supabase table definitions.
2. Verify foreign keys and constraints.
3. Review existing RLS policies.
4. Test access using separate accounts for each role.
5. Confirm that one patient cannot access another patient's protected records.

> This document is an application-level schema inventory, not a database migration script, security certification or HIPAA compliance statement.
