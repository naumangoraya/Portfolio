import jwt from 'jsonwebtoken';

export const verifyAdmin = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, message: 'No token provided' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return { success: false, message: 'No token provided' };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded.isAdmin) {
        return { success: false, message: 'Not authorized as admin' };
      }

      return { success: true, admin: decoded };
    } catch (jwtError) {
      return { success: false, message: 'Invalid token' };
    }
  } catch (error) {
    console.error('Auth middleware - General error:', error);
    return { success: false, message: 'Error verifying admin' };
  }
};
