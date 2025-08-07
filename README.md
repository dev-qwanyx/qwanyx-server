# QWANYX Multi-Tenant Architecture

A flexible multi-tenant platform that powers multiple web applications with shared authentication and infrastructure.

## Current Workspaces

- **Autodin** (autodin-be): Auto parts marketplace - http://localhost:8080
- **Belgicomics** (belgicomics): Comic book store - http://localhost:8091

## Architecture Overview

```
QWANYX-Architecture/
├── qwanyx-api/           # Central API (auth, users, workspaces)
├── autodin/              # Autodin workspace
│   └── frontend/         # Flask + Bulma frontend
├── belgicomics/          # Belgicomics workspace  
│   └── frontend/         # Flask + Bulma frontend
└── start_all_complete.bat # Start all services
```

## Tech Stack

- **Backend**: Flask, JWT authentication
- **Frontend**: Bulma CSS (no React)
- **Database**: MongoDB with workspace-prefixed collections
- **Authentication**: Email code-based (no passwords)

## Quick Start

1. Install dependencies:
   ```bash
   pip install flask pymongo pyjwt python-dotenv requests
   ```

2. Start MongoDB on port 27017

3. Run all services:
   ```bash
   # Windows
   start_all_complete.bat
   
   # Linux/Mac (create equivalent shell script)
   ```

## Database Structure

- System DB: `qwanyx_system` (workspaces, apps)
- Workspace DBs: `qwanyx_workspace_{workspace_id}`
  - Collections: users, contacts, products, etc.

## API Endpoints

Base URL: http://localhost:5002

- `POST /auth/request-code` - Request authentication code
- `POST /auth/verify-code` - Verify code and get JWT
- `POST /users` - Create new user
- `GET /users/me` - Get current user info

## Deployment

Server: Hetzner AX41-NVMe (135.181.72.183)
- Ubuntu 24.04 LTS
- RAID 1 configuration
- Docker + Nginx planned

## Environment Variables

Create `.env` files in each workspace:

```env
WORKSPACE_ID=autodin-be
API_BASE_URL=http://localhost:5002
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Development

- Each workspace has its own Flask app
- Shared API handles authentication
- JWT tokens valid for 7 days
- Session persistence for 5 days of inactivity