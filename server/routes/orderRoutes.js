const express = require('express');
const router = express.Router();

// [Vedanti] Order management routes (/api/orders/*)
router.get('/test', (req, res) => res.json({ message: 'Order route working!' }));

module.exports = router;
