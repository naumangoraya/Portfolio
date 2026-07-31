import jwt from 'jsonwebtoken';

/**
 * The single JWT verification path for the whole API.
 *
 * 16 of the 20 protected routes used to carry their own copy of this with
 * three divergent return contracts (and one that returned 403 where every
 * sibling returned 401). Those copies are gone; use requireAdmin() below.
 */
export const verifyAdmin = async request => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'No token provided' };
  }

  const token = authHeader.substring(7);

  if (!token) {
    return { success: false, message: 'No token provided' };
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured');
    return { success: false, message: 'Server misconfigured' };
  }

  try {
    // Pin the algorithm rather than accepting whatever the token claims.
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    if (!decoded.isAdmin) {
      return { success: false, message: 'Not authorized as admin' };
    }

    return { success: true, admin: decoded };
  } catch {
    // jwt.verify already throws TokenExpiredError on expiry, so the manual
    // `decoded.exp < Date.now()/1000` check the old copies did was unreachable.
    return { success: false, message: 'Invalid or expired token' };
  }
};

export default verifyAdmin;
