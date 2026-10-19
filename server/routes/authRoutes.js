const express = require('express');
const router = express.Router();

// [Aditya] Authentication routes (/api/auth/*)
router.get('/test', (req, res) => res.json({ message: 'Auth route working!' }));

module.exports = router;
