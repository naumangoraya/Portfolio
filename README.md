# 🚀 Dynamic Portfolio Website v4

A modern, database-driven portfolio website built with Next.js 14, MongoDB, and Cloudinary. Features a comprehensive admin panel for real-time content management.

## ✨ Features

### 🎯 **Database-Driven Content**
- **MongoDB Integration**: All content stored in database with flexible schemas
- **Real-time Sync**: Frontend automatically updates when database changes
- **No Required Fields**: All forms accept partial data and update gracefully
- **Flexible Models**: Easy to add new fields without breaking existing functionality

### 🖼️ **Image Management**
- **Cloudinary Integration**: Professional image hosting and optimization
- **Multiple Image Types**: Support for profile pictures, project galleries, logos
- **Automatic Optimization**: Images automatically optimized for web
- **Responsive Images**: Different sizes for different devices

### 🔐 **Admin Panel**
- **Secure Authentication**: JWT-based admin authentication
- **Full CRUD Operations**: Create, read, update, delete for all sections
- **Real-time Editing**: Edit content directly from the frontend
- **Save Buttons**: Every form has save functionality with database sync

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, professional design with smooth animations
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized loading and smooth interactions

### 🗄️ **Content Sections**
- **Hero**: Landing section with customizable greeting and call-to-action
- **About**: Personal information, skills, and experience
- **Projects**: Portfolio projects with images, descriptions, and links
- **Jobs**: Work experience timeline
- **Services**: Offered services with pricing and details
- **Contact**: Contact information and social media links
- **Education**: Educational background and achievements
- **Archive**: Blog posts and articles

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Styled Components
- **Backend**: Next.js API Routes, MongoDB Atlas, Mongoose
- **Database**: MongoDB Atlas (Cloud)
- **Image Storage**: Cloudinary
- **Authentication**: JWT
- **Styling**: Styled Components, CSS-in-JS
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd v4-main
npm install
```

### 2. Environment Setup
Create `.env.local` file:
```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_v4?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 3. Environment Setup
Create `.env.local` file with your MongoDB Atlas connection string and other credentials.

### 4. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

## 📖 MongoDB Atlas Setup

For comprehensive setup instructions, see [SETUP.md](./SETUP.md)

## 🗂️ Project Structure

```
v4-main/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes for all sections
│   ├── admin/             # Admin panel
│   └── page.js            # Main portfolio page
├── lib/                   # Core libraries
│   ├── models/            # MongoDB schemas
│   ├── mongodb.js         # Database connection
│   └── cloudinary.js      # Image management
├── src/                   # Source code
│   └── components/        # React components
└── lib/                   # Core libraries
```

## 🔌 API Endpoints

Each section provides full CRUD operations:

| Section | Endpoint | Methods |
|---------|----------|---------|
| Hero | `/api/hero` | GET, POST, PUT, DELETE |
| About | `/api/about` | GET, POST, PUT, DELETE |
| Projects | `/api/projects` | GET, POST, PUT, DELETE |
| Jobs | `/api/jobs` | GET, POST, PUT, DELETE |
| Services | `/api/services` | GET, POST, PUT, DELETE |
| Contact | `/api/contact` | GET, POST, PUT, DELETE |
| Education | `/api/education` | GET, POST, PUT, DELETE |
| Archive | `/api/archive` | GET, POST, PUT, DELETE |

## 🎨 Customization

### Adding New Fields
1. **Update Model**: Add field to `lib/models/[Model].js`
2. **Add to Forms**: Include field in your admin forms
3. **Automatic**: Database accepts new fields without migration

### Adding New Sections
1. **Create Model**: New schema in `lib/models/`
2. **Add API**: Create routes in `app/api/`
3. **Build Component**: React component in `src/components/sections/`
4. **Include**: Add to main page

### Styling
- **Theme**: Customize colors in `src/styles/theme.js`
- **Components**: Modify styled components in each section
- **Global**: Update `src/styles/GlobalStyle.js`

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms
- Update `MONGODB_URI` for production
- Set production `NEXTAUTH_URL`
- Configure production `JWT_SECRET`

## 🔒 Security Features

- **JWT Authentication**: Secure admin access
- **Input Validation**: All inputs sanitized
- **CORS Protection**: API security
- **Environment Variables**: Sensitive data protected
- **Admin Only**: CRUD operations require authentication

## 📱 Admin Panel Features

- **Real-time Editing**: Edit content directly on the page
- **Image Upload**: Drag & drop image uploads
- **Form Validation**: Client and server-side validation
- **Auto-save**: Automatic saving with visual feedback
- **Content Preview**: See changes before publishing
- **Bulk Operations**: Manage multiple items at once

## 🎯 Use Cases

### For Developers
- **Portfolio Showcase**: Display projects and skills
- **Blog Platform**: Share technical articles
- **Service Marketing**: Promote freelance services
- **Resume Website**: Professional online presence

### For Businesses
- **Company Portfolio**: Showcase work and team
- **Service Pages**: Detailed service descriptions
- **Team Profiles**: Employee introductions
- **Project Gallery**: Client work showcase

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check [SETUP.md](./SETUP.md) for detailed instructions
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions
- **Wiki**: Check project wiki for additional resources

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **MongoDB**: For the flexible database
- **Cloudinary**: For image management
- **Styled Components**: For CSS-in-JS solution
- **Open Source Community**: For inspiration and tools

---

**Made with ❤️ by [Your Name]**

*Ready to build your amazing portfolio? Start with the [Quick Start](#-quick-start) guide above!*
