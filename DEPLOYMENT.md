# 🚀 Deployment Guide for Render

This guide will walk you through deploying the DeFi Portfolio Tracker to [Render](https://render.com) (free tier). We will deploy the **Backend** (Node.js) and **Frontend** (React) as separate services.

## Prerequisites

- [x] A GitHub account with this repository pushed
- [ ] A [Render](https://render.com) account (Sign up with GitHub)

---

## Option A: Automated Deployment (Easiest) 🌟

Render allows you to deploy everything at once using the `render.yaml` file we created.

1. **Sign in to Render** and go to your [Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository (`defi-portfolio-tracker`).
4. Give your blueprint a name (e.g., `defi-tracker-app`).
5. Render will detect the `render.yaml` file and show you two services:
   - `defi-portfolio-backend` (Web Service)
   - `defi-portfolio-frontend` (Static Site)
6. Click **Apply**.

### ⚠️ Important: Configure Environment Variables

The credentials (API Keys) are **not** synced automatically for security. You must add them manually.

1. In the Render Dashboard, go to the **defi-portfolio-backend** service.
2. Click **Environment** from the side menu.
3. Add the following variables (copy values from your local `.env` or Alchemy dashboard):

| Key | Value |
|-----|-------|
| `ALCHEMY_ETHEREUM_KEY` | `your_key_here` |
| `ALCHEMY_POLYGON_KEY` | `your_key_here` |
| `ALCHEMY_ARBITRUM_KEY` | `your_key_here` |
| `ALCHEMY_OPTIMISM_KEY` | `your_key_here` |
| `ALCHEMY_BASE_KEY` | `your_key_here` |

4. Click **Save Changes**. The backend will redeploy automatically.

---

## Option B: Manual Deployment

If the blueprint approach doesn't work or you prefer manual control:

### 1. Deploy Backend

1. **New +** -> **Web Service**
2. Connect your repo
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. **Root Directory:** `backend`
6. Add all **Environment Variables** (Alchemy keys + `PORT=5000`)
7. Deploy!
8. **Copy the Backend URL** (e.g., `https://defi-backend.onrender.com`)

### 2. Deploy Frontend

1. **New +** -> **Static Site**
2. Connect your repo
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `build`
5. **Root Directory:** `frontend`
6. Add **Environment Variable**:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com` (The URL you copied above)
7. Deploy!

---

## 🔍 Verification

1. Open your new frontend URL (e.g., `https://defi-frontend.onrender.com`)
2. Enter an Ethereum address
3. If data loads -> **Success!** 🎉
4. If it fails, check the **Logs** in your Render dashboard for the Backend service.

### Note on Free Tier
Render's free tier spins down the backend after 15 minutes of inactivity. The first request might take **30-50 seconds** to wake it up. This is normal!
