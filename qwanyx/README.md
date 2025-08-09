# QWANYX Dashboard - Quick Start

## Prerequisites
- MongoDB running on localhost:27017
- Python 3.8+
- Flask and pymongo installed

## Installation
```bash
pip install flask pymongo flask-cors bson
```

## Starting the System

### Windows:
```bash
start-qwanyx.bat
```

### Manual Start:
1. Start MongoDB (if not already running)
2. Start API Backend:
   ```bash
   cd backend
   python api.py
   ```
3. Start Frontend (in another terminal):
   ```bash
   cd frontend
   python app_bulma.py
   ```

## Access Points
- **Dashboard**: http://localhost:8080/dashboard
- **API**: http://localhost:5001/api/health

## Features
- Drag & drop columns and cards
- Memory persistence in MongoDB
- ObjectId-based identity system
- PWA support for mobile installation
- Real-time save/load of dashboard state

## Architecture
- Backend uses MongoDB ObjectId as primary identifier
- Each user has their own database: `workspace.users.email@domain`
- All entities (columns, cards) are "memories" with parent-child relationships
- Soft delete preserves data while hiding from UI