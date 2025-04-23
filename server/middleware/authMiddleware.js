const jwt = require('jsonwebtoken');

const JWT_SECRET = 'om-security-service-key'; 
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided, authorization denied');
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.log('Access denied - admin role required. User:', req.user);
    return res.status(403).json({ message: 'Access denied. Admin role required' });
  }
};
exports.isOwnerOrAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') {
      return next();
    }
    
    const requestedCustomerId = parseInt(req.params.id);
    
    if (req.user.customerId === requestedCustomerId) {
      return next();
    }
    
    console.log('Access denied - not owner. User customerId:', 
      req.user.customerId, 'Requested customerId:', requestedCustomerId);
  }
  
  return res.status(403).json({ message: 'Access denied. Not authorized' });
};
exports.optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided, continuing without authentication');
    return next();
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    console.log('Optional token verification successful:', decoded);
    next();
  } catch (error) {
    console.error('Optional token verification failed:', error);
    next();
  }
};