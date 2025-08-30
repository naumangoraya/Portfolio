#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Portfolio Project Setup Wizard');
console.log('================================\n');

async function setup() {
  try {
    // Check if .env.local already exists
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('.env.local already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('Setup cancelled. Using existing .env.local file.');
        rl.close();
        return;
      }
    }

    console.log('📝 Setting up environment variables...\n');

    // MongoDB Configuration
    console.log('🗄️  MongoDB Configuration:');
    const mongoChoice = await question('Use local MongoDB or MongoDB Atlas? (local/atlas): ');
    
    let mongoUri;
    if (mongoChoice.toLowerCase() === 'atlas') {
      const atlasUri = await question('Enter your MongoDB Atlas connection string: ');
      mongoUri = atlasUri;
    } else {
      mongoUri = 'mongodb://localhost:27017/portfolio_v4';
    }

    // JWT Secret
    const jwtSecret = await question('Enter JWT secret (or press Enter for auto-generated): ') || 
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Cloudinary Configuration
    console.log('\n☁️  Cloudinary Configuration:');
    const cloudName = await question('Cloudinary Cloud Name: ');
    const apiKey = await question('Cloudinary API Key: ');
    const apiSecret = await question('Cloudinary API Secret: ');

    // Admin Credentials
    console.log('\n👤 Admin Account Setup:');
    const adminEmail = await question('Admin Email (or press Enter for default): ') || 'admin@example.com';
    const adminPassword = await question('Admin Password (or press Enter for default): ') || 'admin123';

    // NextAuth Configuration
    const nextAuthUrl = await question('NextAuth URL (or press Enter for localhost): ') || 'http://localhost:3000';
    const nextAuthSecret = await question('NextAuth Secret (or press Enter for auto-generated): ') || 
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Generate .env.local content
    const envContent = `# MongoDB Configuration
MONGODB_URI=${mongoUri}

# JWT Secret for Admin Authentication
JWT_SECRET=${jwtSecret}

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=${cloudName}
CLOUDINARY_API_KEY=${apiKey}
CLOUDINARY_API_SECRET=${apiSecret}

# NextAuth Configuration
NEXTAUTH_URL=${nextAuthUrl}
NEXTAUTH_SECRET=${nextAuthSecret}

# Admin User Credentials (for initial setup)
ADMIN_EMAIL=${adminEmail}
ADMIN_PASSWORD=${adminPassword}
`;

    // Write .env.local file
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env.local file created successfully!');

    // Check if MongoDB is running (for local setup)
    if (mongoChoice.toLowerCase() === 'local') {
      console.log('\n🔍 Checking MongoDB connection...');
      try {
        const { MongoClient } = await import('mongodb');
        const client = new MongoClient(mongoUri);
        await client.connect();
        await client.db().admin().ping();
        console.log('✅ MongoDB is running and accessible!');
        await client.close();
      } catch (error) {
        console.log('❌ MongoDB connection failed. Please ensure MongoDB is running.');
        console.log('💡 To start MongoDB:');
        console.log('   - Windows: net start MongoDB');
        console.log('   - macOS/Linux: sudo systemctl start mongod');
        console.log('   - Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
      }
    }

    // Installation instructions
    console.log('\n📋 Next Steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Seed the database: npm run db:seed:all');
    console.log('3. Start development server: npm run dev');
    console.log('4. Visit: http://localhost:3000');
    console.log('5. Admin panel: http://localhost:3000/admin');
    console.log(`6. Login with: ${adminEmail} / ${adminPassword}`);

    // Check if dependencies are installed
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.dependencies) {
        console.log('\n📦 Dependencies found. You can now run:');
        console.log('   npm install');
      }
    }

    console.log('\n🎉 Setup complete! Happy coding!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Manual setup:');
    console.log('1. Copy env.example to .env.local');
    console.log('2. Fill in your configuration values');
    console.log('3. Follow the setup instructions in SETUP.md');
  } finally {
    rl.close();
  }
}

setup();
