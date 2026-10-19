const express = require('express');
const router = express.Router();

// [Arnav] Time slot & capacity routes (/api/slots/*)
router.get('/test', (req, res) => res.json({ message: 'Slot route working!' }));

module.exports = router;
