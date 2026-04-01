# AuthNav Messenger

> A full-stack productivity app that combines secure authentication, customizable user navigation, profile management, and a direct messaging experience in one workflow.

Built as a modern client-server project, this app solves a common onboarding/dashboard problem: users can sign in securely, personalize what they see (profile + navigation), and communicate with other users without leaving the platform.

## Tech Stack

![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/Routing-React_Router-CA4245?logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4?logo=axios&logoColor=white)
![Dnd Kit](https://img.shields.io/badge/Drag_&_Drop-dnd--kit-0B7285)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Framework-Express-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/ODM-Mongoose-880000?logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

### Frontend
- React 19 + Vite 7
- React Router DOM
- Axios (with auth refresh interceptor)
- `@dnd-kit` for drag-and-drop ordering
- CSS Modules + global CSS

### Backend
- Node.js (ES modules) + Express 5
- MongoDB + Mongoose
- JWT authentication (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- `cookie-parser`, `cors`, `dotenv`

### Tooling
- ESLint 9 (client)
- Nodemon (server development)

## Key Features

- User authentication: registration, login, logout, token refresh, forgot-password check, and password reset flow.
- Protected frontend routes for authenticated areas (`/homepage`, `/navigation-edit`, `/messenger`).
- User profile management: fetch profile, edit profile fields, choose avatar, save/cancel changes.
- Custom navigation builder: create/delete menu items, add/delete child links, and reorder items with drag-and-drop.
- Messenger module: conversation list, unread counters, open chat, send messages, mark messages as read, user search.
- Near real-time chat updates implemented with polling (every 3 seconds).
- Secure auth transport using HttpOnly cookies and credentialed requests from client to server.

## Project Structure

```text
.
├── client/
│   ├── src/
│   │   ├── api/                # Axios instance + request modules
│   │   ├── components/         # Reusable UI, route guard, modal, validation
│   │   ├── pages/              # Login, registration, reset, home, nav edit, messenger
│   │   ├── assets/             # Static assets
│   │   └── App.jsx             # Route map and protected routes
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/             # DB connection
│   │   ├── controllers/        # HTTP layer
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   └── utils/              # Token helpers, etc.
│   ├── index.js                # Server entry point
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- MongoDB instance (local or cloud)

### 1) Clone and install

```bash
git clone https://github.com/Gor-Chilingaryan/mesenger_with_auth.git
cd mesenger_with_auth

cd server
npm install

cd ../client
npm install
```

### 2) Configure environment variables

#### Server: `server/.env`

Create `server/.env` based on `server/.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/users_db

ACCESS_SECRET=your_access_secret
ACCESS_EXPIRATION=15m

REFRESH_SECRET=your_refresh_secret
REFRESH_EXPIRATION=7d

# Optional but supported in code:
CLIENT_ORIGIN=http://localhost:5173
```

#### Client: `client/.env`

Create `client/.env` based on `client/.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

> Important: `VITE_API_URL` must match your backend `PORT` (or deployed API URL).

### 3) Run development servers

In two separate terminals:

```bash
# Terminal 1
cd server
npm run dev
```

```bash
# Terminal 2
cd client
npm run dev
```

Then open the frontend URL shown by Vite (usually `http://localhost:5173`).

## Usage

1. Open the app and register a new account (or log in with an existing one).
2. After login, you are redirected to the protected home area.
3. Update your profile details/avatar from the user info section.
4. Manage custom navigation from the navigation editor:
   - create new entries,
   - add/remove child items,
   - drag and reorder items.
5. Open messenger to:
   - search users,
   - open a conversation,
   - send messages,
   - see unread counts update.
6. Use logout to clear session and return to the login page.

## Future Roadmap

- Replace polling messenger updates with WebSockets (real-time events).
- Add email-based forgot-password verification (OTP or secure token flow).
- Introduce automated tests (unit + integration + e2e).
- Add role-based permissions for navigation/profile/message operations.
- Improve deployment readiness (Docker, CI/CD pipeline, health checks).
- Add i18n and accessibility enhancements.
