// [Aditya] authMiddleware.js
// Protect routes (JWT verification) and role guard (staffOnly)

const protect = async (req, res, next) => {
  // Teammate Aditya will implement token verification logic
  next();
};

const staffOnly = (req, res, next) => {
  // Teammate Aditya will implement role checking logic
  next();
};

module.exports = { protect, staffOnly };
