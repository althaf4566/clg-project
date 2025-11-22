// middleware/auth.js
const jwt = require('jsonwebtoken');

// NOTE: Replace 'yourSecretToken' with an environment variable!
const JWT_SECRET = 'yourSecretToken'; 

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user; // Attach user information (e.g., user ID) to the request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};