import jwt from 'jsonwebtoken';

export const verifyAdmin = async (request) => {
  try {
    console.log('Auth middleware - Starting verification');
    
    const authHeader = request.headers.get('authorization');
    console.log('Auth middleware - Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware - No valid auth header');
      return { success: false, message: 'No token provided' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('Auth middleware - Token extracted:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('Auth middleware - No token after extraction');
      return { success: false, message: 'No token provided' };
    }

    try {
      console.log('Auth middleware - Verifying JWT with secret:', process.env.JWT_SECRET ? 'Present' : 'Missing');
      console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - JWT decoded successfully:', { isAdmin: decoded.isAdmin, userId: decoded.userId });
      
      if (!decoded.isAdmin) {
        console.log('Auth middleware - User is not admin');
        return { success: false, message: 'Not authorized as admin' };
      }

      console.log('Auth middleware - Admin verification successful');
      return { success: true, admin: decoded };
    } catch (jwtError) {
      console.error('Auth middleware - JWT verification failed:', jwtError.message);
      return { success: false, message: 'Invalid token' };
    }
  } catch (error) {
    console.error('Auth middleware - General error:', error);
    return { success: false, message: 'Error verifying admin' };
  }
};
