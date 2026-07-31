// Creates (or updates) the admin user in MongoDB using the credentials in
// .env.local (ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME).
//
// Run with:  npm run seed:admin
//
// Env is loaded by Node's built-in --env-file (see the seed:admin script), so
// this no longer needs the dotenv dependency.
//
// The User model hashes the password via a pre-save hook, so we must use
// .save() (not updateOne) for the hashing to run.

import mongoose from 'mongoose';

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!MONGODB_URI || MONGODB_URI.startsWith('PLACEHOLDER')) {
  console.error('❌ MONGODB_URI is not set in .env.local. Add your Atlas connection string first.');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local.');
  process.exit(1);
}

// Inline schema mirroring lib/models/User.js (this script can't import the
// app's ESM/alias modules directly, so we redefine the minimal schema here).
const bcrypt = (await import('bcryptjs')).default;

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER' },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.pre('save', function (next) {
  this.isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(this.role);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('🔌 Connected to MongoDB');

  const email = ADMIN_EMAIL.toLowerCase().trim();
  let user = await User.findOne({ email });

  if (user) {
    user.password = ADMIN_PASSWORD; // triggers re-hash via pre-save
    user.name = ADMIN_NAME || user.name || 'Admin';
    user.role = 'SUPER_ADMIN';
    await user.save();
    console.log(`✅ Updated existing admin user: ${email}`);
  } else {
    user = new User({
      email,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME || 'Admin',
      role: 'SUPER_ADMIN',
    });
    await user.save();
    console.log(`✅ Created admin user: ${email}`);
  }

  console.log('👉 Log in at http://localhost:3000/admin with these credentials.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Failed to create admin user:', err.message);
  process.exit(1);
});
