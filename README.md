# Render Log Analyser

Paste your Render Service ID + API key → fetch live logs → get AI root cause analysis powered by Claude.

## Project structure

```
render-log-analyser/
├── backend/
│   ├── server.js        # Express API (proxies Render API + streams Claude analysis)
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── App.css
```

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
PORT=4000
```

Start:
```bash
npm run dev   # development (nodemon)
npm start     # production
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

For production build:
```bash
npm run build    # outputs to dist/
```

Set `VITE_BACKEND_URL` in a `.env` file if your backend is deployed elsewhere:
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

## How to use

1. Go to [render.com/account/api-keys](https://dashboard.render.com/account/api-keys) and create an API key.
2. Find your Service ID in the Render dashboard URL: `dashboard.render.com/web/srv-xxxxxxxxxx`
3. Paste both into the app and click **Fetch Logs**.
4. Click **Analyse Root Cause** to get a streamed AI analysis.

## Deploying to Render

You can deploy both services to Render:

- **Backend**: New Web Service → connect repo → root dir `backend` → build `npm install` → start `node server.js` → add env var `ANTHROPIC_API_KEY`
- **Frontend**: New Static Site → root dir `frontend` → build `npm install && npm run build` → publish dir `dist` → add env var `VITE_BACKEND_URL` pointing to your backend URL
