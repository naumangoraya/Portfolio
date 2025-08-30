# ✅ Deployment Checklist

## Before Deployment
- [ ] Admin button removed from layout ✅
- [ ] Code pushed to GitHub
- [ ] All environment variables ready
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account set up

## Environment Variables Needed
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Secret key for authentication
- [ ] `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `ADMIN_EMAIL` - Admin login email
- [ ] `ADMIN_PASSWORD` - Admin login password

## Deployment Steps
- [ ] Sign up for Vercel account
- [ ] Connect GitHub repository
- [ ] Add environment variables in Vercel
- [ ] Deploy project
- [ ] Test live site
- [ ] Add custom domain
- [ ] Update DNS records
- [ ] Seed database
- [ ] Test admin panel at `/admin`

## Post-Deployment Tests
- [ ] Homepage loads correctly
- [ ] All sections display properly
- [ ] Admin panel accessible at `/admin`
- [ ] Image uploads work
- [ ] Contact form works
- [ ] All CRUD operations work
- [ ] Mobile responsiveness
- [ ] Custom domain working

## Quick Commands
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Seed database (after deployment)
npm run db:seed:all
```

## Admin Access
- URL: `https://yourdomain.com/admin`
- Email: `admin@example.com`
- Password: `admin123`
