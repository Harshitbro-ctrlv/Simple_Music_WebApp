# Pulse frontend

React frontend for the Spotify project API.

## Development

Run the backend:

```bash
cd backend
npm run dev
```

In a second terminal, run the frontend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

Vite proxies `/api` requests to `http://localhost:3000` during local development.
For a different or deployed backend, copy `.env.example` to `.env` and set
`VITE_API_URL` to the complete API base URL.
