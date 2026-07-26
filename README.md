# Spotify project

The project is split into two independent applications:

- `backend/` — Express, MongoDB, authentication, ImageKit, music and album APIs
- `frontend/` — React and Vite user interface

## Run locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Production deployment

- Deploy `backend/` to Render using the root `render.yaml` Blueprint.
- Deploy `frontend/` to Vercel with `frontend` configured as the project root.
- In Vercel, set `VITE_API_URL` to `https://YOUR-RENDER-SERVICE.onrender.com/api`.
- In Render, set `CLIENT_URL` to the final Vercel production URL without a trailing slash.
- Add `MONGO_URI` and `IMAGEKIT_PRIVATE_KEY` in Render when applying the Blueprint.
