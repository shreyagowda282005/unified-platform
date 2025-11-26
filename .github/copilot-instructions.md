<!-- concise, repo-specific instructions for Copilot-style AI agents -->
# Copilot / AI contributor notes — unified-platform

Short, focused instructions to help AI code contributors get productive quickly in this repo.

- Big picture
  - Monorepo split: backend/ (Node + Express + Mongoose, CommonJS) and frontend/ (React + TypeScript + Vite, ES modules).
  - Realtime messaging via Socket.io configured in `backend/src/server.js` and `frontend/src/services/socketService.ts`.

- Where to look first (high value files)
  - backend: `src/server.js` (entry + sockets), `src/middleware/auth.js` (JWT cookie/header handling), `src/controllers/messageController.js` and `src/models/Message.js` (conversations storage & schemas).
  - frontend: `src/utils/api.ts` (axios withCredentials + interceptors), `src/services/authService.ts` (login/register token flow), `src/services/socketService.ts` (socket lifecycle helpers).

- Environment & quick dev commands
  - backend: put env values in `backend/.env` (MONGODB_URI, JWT_SECRET, FRONTEND_URL, STRIPE_SECRET_KEY, OPENAI_API_KEY). Dev: `cd backend && npm run dev` (nodemon).
  - frontend: env in `frontend/.env` (VITE_API_URL, VITE_SOCKET_URL). Dev: `cd frontend && npm run dev` (vite).
  - Health check: GET /api/health on running backend.

- Authentication & tokens
  - Backend auth middleware accepts JWT in either httpOnly cookie (`req.cookies.token`) or Authorization header (`Bearer <token>`). See `backend/src/middleware/auth.js`.
  - Frontend axios (`frontend/src/utils/api.ts`) uses localStorage token + withCredentials, and redirects to /auth on 401.

- Messaging / realtime specifics
  - Room IDs => sockets join a single string room sent by client; socket events used: `join-room`, `send-message`, `typing`, `receive-message`, `user-typing`. See `server.js` and `socketService.ts`.
  - Messages are persisted in MongoDB using `Message` model (fields include senderId, receiverId, content, attachments, isRead/readAt) and controllers expose `sendMessage`, `getConversations`, `getMessages`.

- Conventions & patterns to follow when coding
  - Backend: CommonJS `require`/`module.exports`, centralized controllers under `src/controllers`, routes under `src/routes` (always use `auth` middleware for protected endpoints).
  - Frontend: TypeScript + ES modules. Centralize HTTP logic in `src/utils/api.ts` and socket handling in `src/services/socketService.ts`.
  - Token & auth state: frontend stores token in localStorage and some flows use httpOnly cookie; ensure both header + cookie flows work if modifying auth.

- Tests / linters / deployment notes
  - Frontend: `npm run build` runs `tsc -b && vite build`; `npm run lint` uses ESLint.
  - Backend: no automated tests present; `npm start` and `npm run dev` are used for prod/dev.
  - Frontend deploy target: Vercel (see README); backend examples target Render / Railway.

- Useful context & quick examples (copiable)
  - Call backend health: curl http://localhost:5000/api/health
  - Example axios usage: `api.post('/auth/login', {email,password})` — token ends up in localStorage and httpOnly cookie.

If any of these sections are unclear or you want more examples (e.g., message UI wiring, authStore shape), tell me which area to expand and I’ll iterate.
