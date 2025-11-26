# Frontend - Influencer Marketing Platform

React TypeScript frontend application.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/services/` - API service functions
- `src/store/` - Zustand state management
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## Features

- Responsive design with yellow/orange theme
- Real-time messaging with Socket.io
- Analytics charts with Recharts
- Protected routes
- AI assistant chatbot
- File upload for portfolio
