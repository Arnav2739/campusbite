const express = require('express');
const router = express.Router();
const { getMenuItems, createMenuItem } = require('../controllers/menuController');

// [Pushkar] Menu catalog routes (/api/menu/*)
router.get('/', getMenuItems);
router.post('/', createMenuItem);
router.get('/test', (req, res) => res.json({ message: 'Menu route working!' }));

module.exports = router;
