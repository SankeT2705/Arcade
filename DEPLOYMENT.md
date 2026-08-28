# 🚀 Duo Arcade — 100% Free Production Deployment Guide

This guide provides step-by-step instructions to deploy **Duo Arcade** completely **free of cost** so two users on **completely different networks** (e.g. User 1 on Jio/Airtel 5G mobile data and User 2 on home Wi-Fi/different ISP) can play seamlessly together anywhere in the world.

---

## 🏗️ Architecture Overview

* **Frontend (Vercel)**: 100% Free tier static SPA with global CDN edge caching and SSL (`https://...`).
* **Backend (Render.com)**: 100% Free tier Node.js Web Service with WebSocket (`wss://`) support and automated SSL.
* **Networking & WebSockets**: Socket.IO automatically handles SSL (`wss://`) handshakes across different network providers and firewalls with fallback to HTTP long-polling if a restrictive network blocks raw WebSockets.

---

## 📌 Step 1: Deploy Backend to Render (Free)

1. Push your repository to **GitHub** (if not already done).
2. Go to **[Render.com](https://render.com)** and sign up / log in with your GitHub account.
3. Click **New +** → Select **Web Service**.
4. Connect your GitHub repository (`duo-arcade`).
5. Configure the service settings:
   * **Name**: `duo-arcade-server` (or any name you prefer)
   * **Region**: Choose closest to your users (e.g. `Singapore`, `Frankfurt`, or `Ohio`)
   * **Root Directory**: `server`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
   * **Instance Type**: **Free** ($0 / month)
6. Add **Environment Variables**:
   * `NODE_ENV` = `production`
   * `CLIENT_URL` = `*` *(or your Vercel URL once created, e.g. `https://duo-arcade.vercel.app`)*
7. Click **Create Web Service**.
8. Render will build and deploy your backend in ~2 minutes.
9. **Copy your backend URL**: E.g. `https://duo-arcade-server.onrender.com`.

---

## 📌 Step 2: Deploy Frontend to Vercel (Free)

1. Go to **[Vercel.com](https://vercel.com)** and sign up / log in with your GitHub account.
2. Click **Add New…** → **Project**.
3. Import your `duo-arcade` repository.
4. Configure the project:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `client` *(Click "Edit" and choose `client`)*
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
5. Add **Environment Variables**:
   * `VITE_SOCKET_URL` = `https://duo-arcade-server.onrender.com` *(Paste your Render URL from Step 1)*
   * `VITE_APP_URL` = `https://your-project-name.vercel.app`
6. Click **Deploy**.
7. Vercel will build and assign you a free public HTTPS URL (e.g. `https://duo-arcade.vercel.app`).

---

## 🌐 Step 3: Testing with 2 Users Across Different Networks

1. **User 1 (Mobile Data / 4G / 5G)**:
   * Open `https://your-project-name.vercel.app` in your mobile browser.
   * Tap **Create Room**, enter your name, and create the room.
   * Tap **Copy Link** (or share the 6-character room code).
2. **User 2 (Home Wi-Fi / Different ISP / Laptop)**:
   * Open the invite link or navigate to the website and tap **Join Room**.
   * Enter name and the room code.
3. Both users will instantly appear in the live lobby, and can select **Scribble Duel** or **Sync or Not** and play live in real time!

---

## 💡 Key Features for Cross-Network Reliability

* **Cross-Origin Handshake (CORS)**: Pre-configured to accept requests from any preview/production Vercel domains with full credentials.
* **Auto-Reconnection**: If mobile data switches towers or Wi-Fi momentarily drops, SocketProvider automatically reconnects in background with a 60-second room reservation grace period.
* **WebRTC & WebSocket Fallback**: Socket.IO automatically transports via `websocket` or fallback `polling` so restrictive corporate/campus firewalls do not block gameplay.
