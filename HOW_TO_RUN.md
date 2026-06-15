# How to Run BizStock - Step by Step Guide

## Prerequisites

1. **Node.js** installed (v16 or higher)
   - Check if installed: `node --version`
   - Download from: https://nodejs.org/

2. **MongoDB** installed and running
   - MongoDB Compass is installed (you mentioned you have it)
   - MongoDB service should be running on port 27017

---

## Step 1: Install Dependencies

Open a terminal in the project folder (`D:\inventory-manager`) and run:

```bash
npm install
```

This will install all required packages (React, Express, MongoDB, etc.)

**Expected time:** 1-2 minutes

---

## Step 2: Verify MongoDB is Running

Check if MongoDB is running:

**Windows:**
- Open **Services** (Win + R, type `services.msc`)
- Look for "MongoDB Server (MongoDB)" - it should be "Running"

Or check in terminal:
```bash
# In PowerShell
Get-Service -Name MongoDB*
```

If it's not running, start it from Services or MongoDB Compass.

---

## Step 3: Set Up Database (First Time Only)

### Option A: Use the Seed Script (Recommended)

In the terminal, run:

```bash
npm run seed
```

This will:
- Create an admin user
- Add 6 sample products to the database

**Login credentials created:**
- Email: `admin@bizstock.com`
- Password: `password123`

### Option B: Manual Setup

If you prefer to create manually, the database `bizstock-inventory` will be created automatically when you first login.

---

## Step 4: Start the Application

### Option A: Run Both Frontend and Backend Together (Recommended)

```bash
npm run dev:all
```

This starts:
- **Backend server** on http://localhost:5000
- **Frontend app** on http://localhost:5173

### Option B: Run Separately (If you want to see logs separately)

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## Step 5: Access the Application

1. Open your web browser
2. Go to: **http://localhost:5173**

You should see the login page.

---

## Step 6: Login

Use the credentials:
- **Email:** `admin@bizstock.com`
- **Password:** `password123`

Click "Login"

---

## What You Should See

After login, you'll see:
- **Overview Page** with summary statistics
- **Sidebar** with navigation options
- **6 sample products** loaded
- All features working (add products, record sales, etc.)

---

## Troubleshooting

### ❌ "Cannot find module" errors
**Solution:** Run `npm install` again

### ❌ Backend not running / "Authentication required"
**Solution:** Make sure backend is running:
- Check if you see "🚀 Server running on port 5000" in terminal
- If not, run `npm run dev:server` in a separate terminal

### ❌ MongoDB connection error
**Solution:**
- Make sure MongoDB service is running (Step 2)
- Check MongoDB Compass - you should be able to connect to `localhost:27017`

### ❌ Port 5000 or 5173 already in use
**Solution:**
- Close other applications using those ports
- Or change ports in `server/.env` (PORT=5001) and restart

### ❌ Products not showing
**Solution:**
- Make sure you ran `npm run seed` (Step 3)
- Check MongoDB Compass - you should see `bizstock-inventory` database with `products` collection

### ❌ Login fails
**Solution:**
- Make sure you ran `npm run seed` to create the user
- Or run `npm run reset-user` to recreate the admin user

---

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

# Seed database (create user and products)
npm run seed

# Reset admin user password
npm run reset-user

# Build for production
npm run build
```

---

## Development Workflow

1. **Start MongoDB** (usually runs automatically as a service)
2. **Start the app:** `npm run dev:all`
3. **Open browser:** http://localhost:5173
4. **Login** and start using the app!

**To stop:** Press `Ctrl + C` in the terminal

---

## Notes

- The app automatically detects if the backend is available
- If backend is down, it works in "offline mode" with local data
- Data persists in MongoDB when backend is running
- LocalStorage is used for session persistence

---

## Need Help?

- Check the terminal for error messages
- Check browser console (F12) for frontend errors
- Verify MongoDB is running
- Make sure all dependencies are installed








