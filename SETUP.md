# 🚀 Quick Setup Guide

## 1. Environment Setup

Create a `.env.local` file in your root directory:

```env
MONGODB_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your-super-secret-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## 2. Database Options

### Option A: Local MongoDB
- Install MongoDB locally
- Start MongoDB service
- Run: `npm run db:seed`

### Option B: MongoDB Atlas (Free Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env.local`
6. Run: `npm run db:seed`

## 3. Start Development

```bash
npm run dev
```

## 4. Access Admin Panel

- **Portfolio**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login**: admin@example.com / admin123

## 5. Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

---

**Need help? Check the main README.md for detailed instructions!**
