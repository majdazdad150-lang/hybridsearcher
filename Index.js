
This guide walks you through deploying your SaaS platform to production. The frontend goes to **Vercel** (free tier works great), and the backend goes to **Render** (also has free tier).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step-by-Step Deployment](#step-by-step-deployment)
3. [Environment Variables](#environment-variables)
4. [PayPal Live Setup](#paypal-live-setup)
5. [Custom Domain](#custom-domain)
6. [Post-Deployment Checklist](#post-deployment-checklist)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, you need:

- [ ] GitHub account with this repo pushed
- [ ] PayPal Business account (for Live payments)
- [ ] MongoDB Atlas account (free tier works)
- [ ] Vercel account (free)
- [ ] Render account (free)

---

## Step-by-Step Deployment

### Phase 1: Database Setup (MongoDB Atlas)

MongoDB Atlas is a free, cloud-hosted MongoDB service perfect for production.

**Step 1: Create MongoDB Atlas Account**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Choose "Create a shared cluster" (free tier)

**Step 2: Create Cluster**
1. Select cloud provider (AWS recommended)
2. Select region closest to you
3. Choose cluster name: `saas-platform`
4. Click "Create Cluster"
5. Wait 3-5 minutes for cluster to spin up

**Step 3: Set Up Database User**
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password"
4. Username: `saas_admin`
5. Password: Generate a strong password (save it!)
6. Set Privileges to "Atlas admin"
7. Click "Add User"

**Step 4: Allow Network Access**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (add 0.0.0.0/0)
4. Click "Confirm"

**Step 5: Get Connection String**
1. Go to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy the connection string
5. Replace `<password>` with your database password
6. It will look like: `mongodb+srv://saas_admin:PASSWORD@cluster.mongodb.net/saas-platform?retryWrites=true&w=majority`
7. Save this - you'll need it later!

---

### Phase 2: Backend Deployment (Render)

**Step 1: Push Code to GitHub**

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

**Step 2: Deploy Backend on Render**

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Click "New +" → "Web Service"
4. Select "Connect a repository"
5. Choose your `saas-platform` repo
6. Fill in deployment details:
   - **Name**: `saas-platform-api`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (you can upgrade later)

7. Click "Create Web Service"
8. Wait for build to complete (~2-3 minutes)

**Step 3: Add Environment Variables to Render**

Once deployed, go to your Render dashboard:

1. Click on your web service
2. Go to "Environment" tab
3. Click "Add Environment Variable"
4. Add these variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://saas_admin:PASSWORD@cluster.mongodb.net/saas-platform?retryWrites=true&w=majority
JWT_SECRET=<generate-secure-random-string>
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-client-secret>
FRONTEND_URL=https://your-vercel-domain.com
```

**How to generate JWT_SECRET:**
```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -SetSeed (Get-Random) -Count 32 | ForEach-Object {[char]$_})))
```

5. Click "Save" and Render will auto-redeploy

**Your backend URL will be**: `https://saas-platform-api.onrender.com`

---

### Phase 3: Frontend Deployment (Vercel)

**Step 1: Deploy Frontend on Vercel**

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Select your `saas-platform` repo
5. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `./frontend`
6. Before clicking "Deploy", go to "Environment Variables"

**Step 2: Add Environment Variables**

Add these environment variables:

```
NEXT_PUBLIC_API_URL=https://saas-platform-api.onrender.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your-paypal-client-id>
```

7. Click "Deploy"
8. Wait for build (~2-3 minutes)

**Your frontend URL will be**: `https://saas-platform.vercel.app` (or your custom domain)

---

### Phase 4: Update Backend with Frontend URL

**Important!** Update the backend's FRONTEND_URL:

1. Go to Render dashboard
2. Click on your API service
3. Go to Environment variables
4. Update `FRONTEND_URL` to your Vercel URL
5. Render will auto-redeploy

---

## Environment Variables

### Complete Reference

**Frontend (.env.local in Vercel)**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_
