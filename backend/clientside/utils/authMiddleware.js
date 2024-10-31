const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from authorization header

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' }); // No token, access denied
  }

  jwt.verify(token, 'gaurav345', (err, user) => { // Use the same secret key used for signing the token
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' }); // Token is invalid
    }
    req.user = user; // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateJWT;
