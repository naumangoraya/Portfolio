# Portfolio Website V4 - Dynamic with Admin Panel

A modern, dynamic portfolio website built with Next.js 14, MongoDB, and a comprehensive admin panel for easy content management.

## ✨ Features

- **Dynamic Content Management**: Update all portfolio content through an intuitive admin panel
- **Real-time Updates**: Changes reflect immediately on the live website
- **Secure Authentication**: JWT-based admin authentication system
- **Responsive Design**: Beautiful, mobile-friendly interface
- **MongoDB Integration**: Robust database backend for content storage
- **Modern Tech Stack**: Built with Next.js 14, React 18, and Styled Components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)
- npm or yarn package manager

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd v4-main
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio_db
# or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/portfolio_db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Admin User (for initial setup)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# In another terminal, seed the database
npm run db:seed
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`
5. Run seeding: `npm run db:seed`

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

## 🔐 Admin Panel Access

- **URL**: `http://localhost:3000/admin`
- **Default Credentials**:
  - Email: `admin@example.com`
  - Password: `admin123`

## 📱 Admin Panel Features

### Currently Available
- ✅ **Dashboard**: Overview and statistics
- ✅ **Hero Section**: Edit main title, subtitle, description, CTA
- ✅ **Projects**: Full CRUD operations for portfolio projects
- 🚧 **Jobs/Experience**: Coming soon
- 🚧 **Services**: Coming soon
- 🚧 **About Section**: Coming soon
- 🚧 **Contact Info**: Coming soon

### Project Management
- Add new projects with images, descriptions, tech stack
- Edit existing project details
- Mark projects as featured
- Organize projects by order
- Delete projects

## 🏗️ Project Structure

```
v4-main/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin panel routes
│   │   ├── login/               # Admin login
│   │   ├── components/          # Admin components
│   │   └── page.js              # Main admin dashboard
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── projects/            # Projects CRUD
│   │   └── hero/                # Hero section management
│   └── page.js                  # Main portfolio page
├── lib/                         # Database and utilities
│   ├── models/                  # MongoDB models
│   ├── mongodb.js               # Database connection
│   └── markdown.js              # Legacy markdown utilities
├── src/                         # Source components
│   ├── components/              # Portfolio components
│   ├── styles/                  # Styled components
│   └── utils/                   # Utility functions
├── scripts/                     # Database scripts
│   └── seed.js                  # Database seeding
└── vercel.json                  # Deployment configuration
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Connect your GitHub repository to [Vercel](https://vercel.com)
- Add environment variables in Vercel dashboard
- Deploy automatically on every push

3. **Environment Variables in Vercel**
```
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Option 2: Other Platforms

The project can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Customization

### Adding New Content Types

1. **Create Model** in `lib/models/`
2. **Create API Routes** in `app/api/`
3. **Create Admin Component** in `app/admin/components/`
4. **Add to Admin Panel** in `app/admin/page.js`

### Styling

- Uses Styled Components for consistent styling
- Theme configuration in `src/styles/theme.js`
- Responsive design with CSS Grid and Flexbox

## 📊 Database Schema

The application uses MongoDB with the following main collections:

- **Users**: Admin authentication
- **Hero**: Main landing section content
- **Projects**: Portfolio projects with full metadata
- **Jobs**: Work experience and employment history
- **Services**: Offered services and skills
- **About**: Personal information and skills
- **Contact**: Contact details and social links

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:seed      # Seed database with sample data
```

### Adding New Features

1. **Backend**: Create MongoDB models and API routes
2. **Frontend**: Create React components with styled-components
3. **Admin**: Add to admin panel for content management
4. **Testing**: Test locally before deploying

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation and sanitization
- Secure database connections

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly admin interface
- Optimized for all device sizes

## 🚀 Performance

- Next.js 14 with App Router
- Server-side rendering
- Optimized images with Next.js Image
- Efficient database queries
- Minimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running and accessible
4. Check the browser console for frontend errors

## 🔮 Future Enhancements

- [ ] Blog post management
- [ ] Image upload and management
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] SEO optimization tools
- [ ] Backup and restore functionality
- [ ] User roles and permissions
- [ ] API rate limiting
- [ ] Webhook integrations

---

**Built with ❤️ using Next.js, MongoDB, and Styled Components**
