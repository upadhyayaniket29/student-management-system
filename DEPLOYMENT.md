# Deployment Guide

## Prerequisites
- GitHub account with repository: https://github.com/upadhyayaniket29/student-management-system
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas cluster running

## Backend Deployment (Render)

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add deployment configurations and fix environment setup"
git push origin main
```

### Step 2: Create Render Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `upadhyayaniket29/student-management-system`
4. Configure the service:
   - **Name**: `student-management-backend` (or your preferred name)
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: Leave empty (render.yaml handles this)
   - **Environment**: `Node`
   - **Build Command**: `cd backend/server && npm install`
   - **Start Command**: `cd backend/server && npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables
In the Render dashboard, add these environment variables:
- `MONGODB_URI` = `mongodb+srv://aniket:Aniket@cluster0.dmag7lt.mongodb.net/student-management?retryWrites=true&w=majority&appName=Cluster0`
- `JWT_SECRET` = `your_super_secret_jwt_key_change_this_in_production`
- `ADMIN_SECRET_KEY` = `admin_secret_key_2024`
- `NODE_ENV` = `production`
- `PORT` = `5000`

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://student-management-backend-xxxx.onrender.com`)

### Step 5: Test Backend
Visit: `https://your-app.onrender.com/api/health`

Expected response:
```json
{"message": "Server is running", "status": "OK"}
```

---

## Frontend Deployment (Vercel)

### Step 1: Update Production Environment
1. Edit `frontend/.env.production`
2. Replace `YOUR_RENDER_APP_NAME` with your actual Render URL:
   ```
   NEXT_PUBLIC_API_URL=https://student-management-backend-xxxx.onrender.com/api
   ```
3. Commit and push:
   ```bash
   git add frontend/.env.production
   git commit -m "Update production API URL"
   git push origin main
   ```

### Step 2: Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `upadhyayaniket29/student-management-system`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables:
- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: `https://your-render-backend.onrender.com/api`
- **Environment**: Production

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Copy your frontend URL (e.g., `https://student-management-system.vercel.app`)

---

## Post-Deployment Testing

### 1. Test Backend API
```bash
curl https://your-backend.onrender.com/api/health
```

### 2. Test Frontend
1. Visit your Vercel URL
2. Try logging in with seeded credentials:
   - **Student**: `student@example.com` / `password123`
   - **Admin**: `admin@example.com` / `admin123`

### 3. Check Browser Console
- Open DevTools → Console
- Look for any CORS or API connection errors
- Verify API calls are going to Render backend

---

## Troubleshooting

### Backend Issues
- **Build fails**: Check that `backend/server/package.json` exists
- **MongoDB connection fails**: Verify `MONGODB_URI` in Render environment variables
- **500 errors**: Check Render logs in dashboard

### Frontend Issues
- **API calls fail**: Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- **Build fails**: Check that all dependencies are in `frontend/package.json`
- **CORS errors**: Ensure backend CORS is configured to allow your Vercel domain

### Common Issues
- **Render free tier**: First request may take 30-60 seconds (cold start)
- **Environment variables**: Must start with `NEXT_PUBLIC_` for client-side access in Next.js
- **Image uploads**: May not persist on Render free tier (ephemeral filesystem)

---

## Important Notes

⚠️ **Security**: Change `JWT_SECRET` and `ADMIN_SECRET_KEY` to strong random values in production

⚠️ **Database**: Consider creating a separate MongoDB user for production with limited permissions

⚠️ **Free Tier Limitations**:
- Render: Service spins down after 15 minutes of inactivity
- Vercel: 100GB bandwidth per month
- MongoDB Atlas: 512MB storage

---

## URLs Reference

After deployment, save these URLs:
- **Backend API**: `https://_____.onrender.com`
- **Frontend**: `https://_____.vercel.app`
- **MongoDB**: `mongodb+srv://aniket:Aniket@cluster0.dmag7lt.mongodb.net`
