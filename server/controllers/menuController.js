// [Pushkar] menuController.js - Menu CRUD & filtering
const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items with category, veg, and search filtering
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const { category, isVeg, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (isVeg !== undefined && isVeg !== '') {
      query.isVeg = isVeg === 'true';
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await MenuItem.find(query).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving menu', error: error.message });
  }
};

// @desc    Create a new menu item
// @route   POST /api/menu
// @access  Staff Only
const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, isVeg, isAvailable, imageUrl, prepTime } = req.body;

    const newItem = await MenuItem.create({
      name,
      category,
      price,
      isVeg: isVeg !== undefined ? isVeg : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      imageUrl: imageUrl || '',
      prepTime: prepTime || 10,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Invalid menu item data', error: error.message });
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
};
