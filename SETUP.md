# Portfolio Project Setup Guide

This guide will help you set up the portfolio project with MongoDB local database and Cloudinary for image management.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation)
- Cloudinary account
- Git

## 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd v4-main
npm install
```

## 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# MongoDB Configuration (Local)
MONGODB_URI=mongodb://localhost:27017/portfolio_v4

# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Admin User Credentials (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## 3. MongoDB Local Setup

### Option A: MongoDB Community Edition

1. Download and install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Option B: Docker

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option C: MongoDB Atlas (Cloud)

If you prefer cloud hosting, update your `.env.local`:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_v4
```

## 4. Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the Dashboard
3. Update your `.env.local` with the credentials

## 5. Database Seeding

Populate your database with sample data:

```bash
# Seed all sections
npm run db:seed:all

# Or seed individual sections
npm run db:seed
```

## 6. Start Development Server

```bash
npm run dev
```

Your portfolio will be available at `http://localhost:3000`

## 7. Admin Access

- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@example.com` (or as set in .env.local)
- **Password**: `admin123` (or as set in .env.local)

## 8. Project Structure

```
v4-main/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── hero/          # Hero section API
│   │   ├── about/         # About section API
│   │   ├── projects/      # Projects API
│   │   ├── jobs/          # Jobs API
│   │   ├── services/      # Services API
│   │   ├── contact/       # Contact API
│   │   ├── education/     # Education API
│   │   ├── archive/       # Archive API
│   │   └── upload/        # File upload API
│   ├── admin/             # Admin panel
│   └── page.js            # Main page
├── lib/                   # Library files
│   ├── models/            # MongoDB models
│   ├── mongodb.js         # Database connection
│   └── cloudinary.js      # Cloudinary configuration
├── src/                   # Source components
│   └── components/        # React components
├── scripts/               # Database scripts
└── content/               # Static content
```

## 9. Database Models

All models are designed with:
- **No required fields** - All data is optional
- **Flexible schema** - Easy to add new fields
- **Image support** - Cloudinary integration
- **Ordering** - Sortable content
- **Active/Inactive** - Content management

### Available Models:
- **Hero** - Main landing section
- **About** - Personal information and skills
- **Projects** - Portfolio projects
- **Jobs** - Work experience
- **Services** - Offered services
- **Contact** - Contact information
- **Education** - Educational background
- **Archive** - Blog posts and articles

## 10. API Endpoints

Each section has full CRUD operations:

- `GET /api/[section]` - Fetch data
- `POST /api/[section]` - Create new record
- `PUT /api/[section]` - Update existing record
- `DELETE /api/[section]` - Delete record

## 11. Features

### Frontend
- ✅ Real-time data from database
- ✅ Admin controls for all sections
- ✅ Save buttons for all forms
- ✅ Image upload via Cloudinary
- ✅ Responsive design
- ✅ SEO optimized

### Backend
- ✅ MongoDB local/cloud support
- ✅ JWT authentication
- ✅ Admin-only operations
- ✅ Image management
- ✅ Flexible data models
- ✅ Error handling

## 12. Customization

### Adding New Fields
1. Update the model in `lib/models/[Model].js`
2. Add the field to your forms
3. Update API routes if needed
4. The database will automatically accept new fields

### Adding New Sections
1. Create a new model in `lib/models/`
2. Create API routes in `app/api/`
3. Add components in `src/components/sections/`
4. Update the main page to include the section

## 13. Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"

# Check connection string
echo $MONGODB_URI
```

### Cloudinary Issues
```bash
# Verify credentials
node -e "console.log(process.env.CLOUDINARY_CLOUD_NAME)"
```

### Port Conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
npm run dev -- -p 3001
```

## 14. Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Update `MONGODB_URI` for production database
- Set production `NEXTAUTH_URL`
- Configure production `JWT_SECRET`

## 15. Security Notes

- Keep your `.env.local` file private
- Use strong JWT secrets
- Regularly update dependencies
- Monitor admin access logs

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API responses in browser dev tools
3. Check MongoDB logs
4. Verify environment variables

## License

MIT License - see LICENSE file for details.
