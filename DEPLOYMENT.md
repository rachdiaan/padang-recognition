# Backend Deployment Guide (Render.com)

Since you have a separate backend (Node.js/Express) and frontend (React/Vite), it's recommended to deploy them as separate services.

## 1. Deploy Backend (Server)
We recommend **Render.com** (it has a free tier for Node.js).

1.  Push your latest code to GitHub.
2.  Go to [dashboard.render.com](https://dashboard.render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Root Directory**: `server` (Important!)
6.  **Build Command**: `npm install && npm run build`
7.  **Start Command**: `npm start`
8.  **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: (Your MongoDB Connection String)
    *   `JWT_SECRET`: (Your Secret Key)

### 💡 How to get these values:
1.  **MONGO_URI**:
    *   Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    *   Create a Cluster (Shared/Free).
    *   Go to "Database Access" -> Add New Database User (remember username/password).
    *   Go to "Network Access" -> Allow Access from Anywhere (`0.0.0.0/0`).
    *   Go to "Database" -> Connect -> Drivers -> Copy the connection string.
    *   Replace `<password>` with your actual password.
2.  **JWT_SECRET**:
    *   This can be any random long string (password).
    *   Example: `rahasia_padang_123_abc_!@#` or generate a UUID.

9.  Click **Create Web Service**.

## 2. Connect Frontend
Once deployed, Render will give you a URL (e.g., `https://padang-server.onrender.com`).
You need to update your Frontend to point to this URL instead of `localhost:5000`.

Update `src/components/admin/AdminLogin.tsx`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Use API_URL in your fetch calls
```

### 3. Configure Netlify (Frontend)
1.  Go to your **Netlify Dashboard** -> Site Settings.
2.  **Environment Variables** -> **Add a variable**.
3.  Key: `VITE_API_URL`
4.  Value: (The URL of your deployed Backend from Step 1, e.g., `https://padang-server.onrender.com`) - **NO trailing slash** `/`
5.  **Trigger a new deploy** (or Retry Deploy) for changes to take effect.
