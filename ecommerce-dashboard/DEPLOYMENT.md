# Vercel Deployment Guide

## 🚀 Steps to Deploy Your E-commerce Dashboard

### Prerequisites
- [Vercel CLI](https://vercel.com/cli) installed globally
- [Git](https://git-scm.com/) installed
- MongoDB Atlas account (for production database)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Set up MongoDB Atlas (Production Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string (replace `<password>` with your actual password)
5. Whitelist your IP addresses (or use 0.0.0.0/0 for all IPs)

### Step 3: Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 4: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy the project
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name: ecommerce-dashboard (or your preferred name)
# - In which directory is your code located? ./
```

### Step 5: Configure Environment Variables
After deployment, you need to set up environment variables:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your deployed project
3. Go to Settings → Environment Variables
4. Add these variables:

```
MONGODB_URI = mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecom_dashboard?retryWrites=true&w=majority
NODE_ENV = production
```

### Step 6: Seed Production Database
After setting environment variables, you can seed your production database:

1. Update your local `.env` file with the production MongoDB URI
2. Run: `npm run seed`
3. Or create a Vercel Function to seed data

### Step 7: Redeploy with Environment Variables
```bash
vercel --prod
```

## ✅ Verification Steps

1. **Check the frontend**: Visit your Vercel URL
2. **Test API endpoints**: Visit `https://your-domain.vercel.app/api/health`
3. **Verify map functionality**: Ensure the state map loads with data
4. **Test real-time updates**: Verify the refresh functionality works

## 🔧 Troubleshooting

### Common Issues:

1. **API Routes Not Working**
   - Ensure `vercel.json` is properly configured
   - Check that API routes start with `/api/`

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check if IP addresses are whitelisted
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Verify Node.js version compatibility

4. **CORS Issues**
   - CORS is already configured in the backend
   - Ensure API and frontend are on the same domain

### Environment Variables Format:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecom_dashboard
NODE_ENV=production
```

## 📱 Final URLs
- **Frontend**: `https://your-project-name.vercel.app`
- **API Health Check**: `https://your-project-name.vercel.app/api/health`
- **States API**: `https://your-project-name.vercel.app/api/states`

Your dashboard will be live with real-time state revenue data! 🎉
