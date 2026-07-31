import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../lib/models/User';
import { fail } from '../../../../lib/api/respond';
import { handleDbError } from '../../../../lib/api/handleDbError';
import { rateLimit, clientIp } from '../../../../lib/api/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Both fields MUST be strings. Previously the raw JSON values went straight
// into the Mongoose query, so `{"username":{"$ne":null}}` selected the first
// admin without knowing any email address.
const LoginSchema = z.object({
  username: z.string().min(1).max(320),
  password: z.string().min(1).max(200),
});

export async function POST(request) {
  try {
    const ip = clientIp(request);

    const byIp = rateLimit(`login:ip:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 });
    if (!byIp.allowed) {
      return fail(429, 'RATE_LIMITED', `Too many attempts. Try again in ${byIp.retryAfter}s.`);
    }

    const parsed = LoginSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return fail(400, 'VALIDATION', 'Username and password are required');
    }

    const { username, password } = parsed.data;

    const byAccount = rateLimit(`login:user:${username.toLowerCase()}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
    if (!byAccount.allowed) {
      return fail(429, 'RATE_LIMITED', `Too many attempts. Try again in ${byAccount.retryAfter}s.`);
    }

    await dbConnect();

    const user = await User.findOne({
      email: username.toLowerCase(),
      role: { $in: ['ADMIN', 'SUPER_ADMIN'] },
      isActive: true,
    }).select('+password');

    // Always run a bcrypt comparison so a missing account and a wrong password
    // take comparable time (the old code returned early, leaking which emails
    // exist via response timing).
    const hash =
      user?.password || '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
    const passwordMatches = await bcrypt.compare(password, hash);

    if (!user || !passwordMatches) {
      return fail(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return fail(500, 'SERVER_ERROR', 'Internal server error');
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        isAdmin: true,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h', algorithm: 'HS256' }
    );

    const payload = {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    // `token`/`user` stay at the response root: AdminLogin reads `data.token`
    // directly. Dropped once the client moves to the { ok, data } envelope.
    return NextResponse.json({
      ok: true,
      success: true,
      message: 'Login successful',
      data: payload,
      ...payload,
    });
  } catch (error) {
    return handleDbError(error, 'auth/login');
  }
}
