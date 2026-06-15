# BizStock Full-Stack Setup Guide

This guide will help you set up the full-stack BizStock application with Node.js/Express backend and MongoDB database.

## Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - You can either:
  - Install MongoDB locally - [Download here](https://www.mongodb.com/try/download/community)
  - Use MongoDB Atlas (cloud) - [Sign up here](https://www.mongodb.com/cloud/atlas)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all dependencies for both frontend and backend.

### 2. Set Up MongoDB

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **Mac/Linux**: `sudo systemctl start mongod` or `brew services start mongodb-community`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/bizstock`)

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp server/.env.example server/.env
   ```

2. Edit `server/.env` and update the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/bizstock
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bizstock

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

3. Create a `.env` file in the root directory for frontend (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Application

#### Option A: Run Frontend and Backend Separately

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option B: Run Both Together (Recommended)

```bash
npm run dev:all
```

This uses `concurrently` to run both servers simultaneously.

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Creating Your First User

Currently, the application doesn't have a registration page in the UI. You can create a user in one of these ways:

### Option 1: Using MongoDB Compass or CLI

Connect to your MongoDB database and insert a user document:

```javascript
// Note: Password should be hashed with bcrypt
// Use the backend API to register instead (see Option 2)
```

### Option 2: Using API (Recommended)

Use a tool like Postman or curl to register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bizstock.com",
    "password": "password123",
    "displayName": "Admin",
    "businessName": "My Business"
  }'
```

Or use the browser console or Postman:
- POST to `http://localhost:5000/api/auth/register`
- Body (JSON):
```json
{
  "email": "admin@bizstock.com",
  "password": "password123",
  "displayName": "Admin",
  "businessName": "My Business"
}
```

### Option 3: Use Mock Mode

If the backend is not running, the application will automatically fall back to mock mode, where you can login with any credentials (no validation).

## Project Structure

```
inventory-manager/
├── server/                 # Backend code
│   ├── index.js           # Express server entry point
│   ├── models/            # MongoDB models (User, Product, Sale, Activity)
│   ├── routes/            # API routes (auth, products, sales, activity)
│   ├── middleware/        # Express middleware (authentication)
│   └── .env.example       # Environment variables template
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── utils/             # Utilities (api.js for API calls)
│   └── App.jsx            # Main app component
├── package.json           # Dependencies and scripts
└── SETUP.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/business-name` - Update business name
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Record new sale
- `DELETE /api/sales/:id` - Delete sale

### Activity
- `GET /api/activity` - Get activity log
- `POST /api/activity` - Create activity entry

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoNetworkError"**
- Make sure MongoDB is running (if using local)
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

**Error: "Port 5000 already in use"**
- Change `PORT` in `server/.env` to a different port (e.g., 5001)
- Update `VITE_API_URL` in frontend `.env` to match

### CORS Errors

- Make sure `CLIENT_URL` in `server/.env` matches your frontend URL
- Check that credentials are enabled in API calls

### Authentication Not Working

- Verify JWT_SECRET is set in `server/.env`
- Check browser console for API errors
- Ensure cookies are enabled in your browser

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `server/.env`
2. Use a strong, unique `JWT_SECRET`
3. Use MongoDB Atlas or a managed MongoDB service
4. Set up proper CORS origins
5. Use HTTPS for both frontend and backend
6. Build the frontend: `npm run build`
7. Serve the built files with a static file server or CDN

## Need Help?

- Check the console logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure MongoDB is accessible
- Check that all dependencies are installed (`npm install`)








