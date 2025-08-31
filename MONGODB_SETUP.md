# 🗄️ MongoDB Atlas Setup

## Quick Setup

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Project**: Name it "Portfolio Website"
3. **Build Database**: Choose FREE tier (M0)
4. **Set Up Access**: Create database user with read/write permissions
5. **Network Access**: Allow access from anywhere (0.0.0.0/0)
6. **Get Connection String**: Click Connect → Connect your application

## Environment Variables

Create `.env.local` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_v4?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Test Connection

```bash
npm run dev
```

Look for "Connected to MongoDB" in the console.

## Security Notes

- Use strong passwords
- Keep `.env.local` private
- Restrict network access in production
