# Quick Start Guide - BizStock

## Step 1: Install Dependencies

```bash
npm install
```

This installs all backend and frontend dependencies.

## Step 2: Set Up MongoDB

### Option A: Use Local MongoDB (Recommended for Development)

1. **Download MongoDB Community Edition:**
   - Windows: https://www.mongodb.com/try/download/community
   - After installation, MongoDB runs as a service automatically

2. **Verify MongoDB is running:**
   - Open Command Prompt or PowerShell
   - Run: `mongod --version` (should show version info)

### Option B: Use MongoDB Atlas (Cloud - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string (looks like: `mongodb+srv://user:pass@cluster.mongodb.net/bizstock`)

## Step 3: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   copy server\.env.example server\.env
   ```
   (On Mac/Linux: `cp server/.env.example server/.env`)

2. **Edit `server/.env` and set your MongoDB connection:**

   **For Local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/bizstock
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/bizstock
   ```

   **Other settings (keep defaults for now):**
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   CLIENT_URL=http://localhost:5173
   ```

## Step 4: Start the Application

### Option A: Run Both Servers Together (Easiest)

```bash
npm run dev:all
```

This starts both frontend (port 5173) and backend (port 5000) simultaneously.

### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Step 5: Create Your First User

The app will work in "mock mode" if the backend isn't running, but for full functionality:

1. **Open your browser** and go to: http://localhost:5000/api/health
   - Should see: `{"status":"ok","message":"Server is running"}`

2. **Create a user using one of these methods:**

   **Method 1: Using curl (in Command Prompt/PowerShell):**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"admin@bizstock.com\",\"password\":\"password123\",\"displayName\":\"Admin\",\"businessName\":\"My Business\"}"
   ```

   **Method 2: Using Postman or any API client:**
   - Method: POST
   - URL: `http://localhost:5000/api/auth/register`
   - Headers: `Content-Type: application/json`
   - Body (JSON):
     ```json
     {
       "email": "admin@bizstock.com",
       "password": "password123",
       "displayName": "Admin",
       "businessName": "My Business"
     }
     ```

   **Method 3: Using Browser Console (on the app page):**
   ```javascript
   fetch('http://localhost:5000/api/auth/register', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       email: 'admin@bizstock.com',
       password: 'password123',
       displayName: 'Admin',
       businessName: 'My Business'
     })
   }).then(r => r.json()).then(console.log);
   ```

## Step 6: Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

Login with the credentials you just created!

## Troubleshooting

### ❌ "Cannot find module" errors
**Solution:** Run `npm install` again

### ❌ MongoDB connection error
**Solution:** 
- Make sure MongoDB is running (local) or connection string is correct (Atlas)
- Check `server/.env` file exists and has correct `MONGODB_URI`

### ❌ Port 5000 already in use
**Solution:** Change `PORT=5001` in `server/.env` (and update `CLIENT_URL` if needed)

### ❌ Can't login / "Authentication required"
**Solution:** Make sure you've created a user first (Step 5)

### ⚠️ App works but says "mock mode"
**Solution:** Backend isn't running. Start it with `npm run dev:server` or `npm run dev:all`

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Run everything (frontend + backend)
npm run dev:all

# Run only backend
npm run dev:server

# Run only frontend
npm run dev

# Build for production
npm run build
```

## Need Help?

- Check the browser console (F12) for errors
- Check the terminal where you ran `npm run dev:server` for backend errors
- Make sure MongoDB is running and accessible
- Verify your `.env` file is configured correctly








