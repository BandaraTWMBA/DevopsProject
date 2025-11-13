# DevopsProject - Copilot Instructions

A full-stack healthcare authentication application with containerized frontend and backend, deployed via Jenkins CI/CD pipeline to Docker Hub.

## Architecture Overview

**Three-tier stack:**
- **Frontend**: React 19 + Vite + Tailwind CSS + React Router (port 5173)
- **Backend**: Express.js + MongoDB + bcryptjs for auth (port 5000)
- **Database**: MongoDB 6 (port 27017)

All services containerized via Docker Compose and pushed to Docker Hub through Jenkins pipeline with image tags based on git commit SHA.

## Developer Workflow

### Local Development
```bash
# Backend: nodemon auto-reloads on changes
cd backend && npm run dev

# Frontend: Vite dev server with HMR
cd frontend && npm run dev

# Or use docker-compose for full stack
docker-compose up
```

### Build & Deploy
- **Jenkins CI**: `Jenkinsfile` orchestrates build → tag → push to Docker Hub
- Images tagged as `budhathribandara/health-{backend|frontend}:{commit-sha}` and `latest`
- Environment variables: `NODE_ENV=development`, `MONGODB_URI=mongodb://mongo:27017/devops_db`, `VITE_API_URL=http://localhost:5000`

### Frontend Build
```bash
npm run build    # Vite build to dist/
npm run lint     # ESLint check
npm run preview  # Test production build locally
```

## Code Patterns & Conventions

### Authentication Flow
1. **Register** (`POST /register`): Validates firstname/email/password (6+ chars), hashes with bcryptjs salt=10, stores in MongoDB
2. **Login** (`POST /login`): Compares plaintext vs hashed password using bcrypt, returns user object
3. **Protected Routes**: React Router `PrivateRoute` checks `localStorage.getItem('user')` (set by Login.jsx)

### Backend (Express)
- **Middleware stack**: CORS enabled, JSON parser for `express.json()`
- **MongoDB connection**: Via Mongoose, auto-connects to `MONGODB_URI` env var
- **User schema**: `firstname`, `email` (unique, lowercase), `password`, `timestamps` auto-added
- **Password hashing**: Pre-save hook on User schema, compare via `user.comparePassword()` method
- **Error handling**: Try-catch blocks with 400/401/500 status codes; validation before DB operations

### Frontend (React + Vite)
- **Routing structure**: `/login` → `/register` → `/home` (protected)
- **State management**: React hooks (useState, useNavigate) per component; localStorage for persistence
- **API calls**: Axios to `http://localhost:5000` endpoints
- **Styling**: Tailwind CSS utility-first; Login/Register have matching gradient UI patterns
- **Form handling**: Controlled components with `onChange` events, submit preventDefault

### Docker & Compose
- **Backend Dockerfile**: Node 18-alpine, volumes for live reload during development
- **Frontend Dockerfile**: Node 22, runs `npm run dev -- --host` to expose dev server
- **Compose services**: Explicit image names (`health_backend`, `health_frontend`), health_mongo; depends_on sequencing

## Key Integration Points

- **Frontend → Backend**: Hardcoded API URL in Login/Register; ensure `VITE_API_URL` env matches backend endpoint
- **MongoDB persistence**: `mongo_data` volume in docker-compose survives container restarts
- **Jenkins credentials**: Uses `'github_pat'` Jenkins credential ID for Docker Hub auth; ensure it's configured before running pipeline
- **Deployment pipeline**: Git commit SHA is source of truth for image tags via `git rev-parse --short HEAD`

## Critical Files to Understand First

- `backend/server.js`: Express app, User model, auth endpoints (Auth logic core)
- `frontend/src/App.jsx`: Routing & PrivateRoute component
- `frontend/src/pages/Login.jsx`, `Register.jsx`: Form patterns & localStorage usage
- `docker-compose.yml`: Service interdependencies & environment setup
- `Jenkinsfile`: Build stages, Docker image tagging convention

## Common Tasks

**Add new backend endpoint**: Update `server.js`, add route with validation, use User model for data access, follow error response format `{success: bool, message: string, [data]}`

**Add frontend page**: Create `.jsx` in `frontend/src/pages/`, add Route in `App.jsx`, use `useNavigate` for redirects, axios for API calls, Tailwind for styling

**Modify auth flow**: Backend: edit User schema pre-save hook or comparePassword method; Frontend: update localStorage keys in Login.jsx and check in PrivateRoute

**Update docker setup**: Edit `docker-compose.yml` service definitions or Dockerfiles; test with `docker-compose build && docker-compose up`

**Trigger deployment**: Push to `main` branch; Jenkins picks up Jenkinsfile, builds images, tags with commit SHA, pushes to `budhathribandara/{service}:latest`
