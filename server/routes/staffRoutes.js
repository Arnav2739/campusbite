const express = require('express');
const router = express.Router();

// [Anish] Staff kitchen queue and analytics routes (/api/staff/*)
router.get('/test', (req, res) => res.json({ message: 'Staff route working!' }));

module.exports = router;
