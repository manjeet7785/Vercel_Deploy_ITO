# ITO Task Server

Backend scaffold for the assignment requirements shown in the PDF screenshots.

## Tech Stack
- Node.js
- Express
- MongoDB / Mongoose
- JWT auth
- Multer file uploads

## Setup
1. Install dependencies:

```bash
cd G:\Ev\Task\Server
npm install
```

2. Create `.env` from `.env.example`.
3. Start the server:

```bash
npm run dev
```

## Included APIs
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/ai/leads/from-chat`
- `POST /api/v1/leads/from-chat`
- `GET /api/v1/leads`
- `GET /api/v1/leads/:leadId`
- `POST /api/v1/leads/:leadId/activity`
- `PATCH /api/v1/leads/:leadId/stage`
- `PATCH /api/v1/admin/leads/:leadId/assign`
- `POST /api/v1/documents/upload`
- `GET /api/v1/documents/:id/download`
- `PATCH /api/v1/documents/:id/access-level`
- `DELETE /api/v1/documents/:id`
- `GET /api/v1/admin/dashboard/summary`
- `GET /api/v1/admin/dashboard/pipeline`
- `GET /api/v1/admin/dashboard/employee-performance`
- `GET /api/v1/admin/dashboard/security-alerts`
- `GET /api/v1/admin/dashboard/quotation-queue`
- `POST /api/v1/security/reveal`
- `GET /api/v1/security/logs`
- `GET /api/v1/security/alerts`
- `POST /api/v1/quotations/request`
- `GET /api/v1/quotations/pending`
- `PATCH /api/v1/quotations/:id/approve`
- `PATCH /api/v1/quotations/:id/reject`
- `POST /api/v1/dispatch`
- `GET /api/v1/dispatch`
- `PATCH /api/v1/dispatch/:id`
- `POST /api/v1/payments`
- `GET /api/v1/payments`
- `PATCH /api/v1/payments/:id`
- `GET /api/v1/reports/admin-summary`

## MongoDB
The provided MongoDB URL is already set as the default fallback in `src/config/db.js` and documented in `.env.example`.
