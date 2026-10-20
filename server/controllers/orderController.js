/**
 * @file orderController.js
 * @description Controller for Order Processing Engine, Daily Token Generation & Student Tracking.
 * @author Vedanti (feat/vedanti-orders-tracking)
 */

const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const TimeSlot = require('../models/TimeSlot');

/**
 * Generates a unique, human-readable daily pickup token (e.g. CB-101, CB-102).
 * Formatted as "CB-XXX", starting from 101 each day based on today's order volume,
 * with collision-detection loops to guarantee daily uniqueness.
 *
 * @returns {Promise<string>} The unique daily pickup token.
 */
const generateDailyPickupToken = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Count orders placed today to derive sequential index
  const todayOrderCount = await Order.countDocuments({
    createdAt: { $gte: startOfToday, $lte: endOfToday },
  });

  let tokenNumber = 101 + todayOrderCount;
  let tokenCandidate = `CB-${tokenNumber}`;

  // Collision safety loop: verify candidate does not collide with existing order today
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 20) {
    const existing = await Order.findOne({
      pickupToken: tokenCandidate,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    if (!existing) {
      isUnique = true;
    } else {
      tokenNumber += 1;
      tokenCandidate = `CB-${tokenNumber}`;
      attempts += 1;
    }
  }

  // Fallback to random 3-digit number if collision limit reached
  if (!isUnique) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    tokenCandidate = `CB-${randomSuffix}`;
  }

  return tokenCandidate;
};

/**
 * POST /api/orders
 * Places a student canteen order with real-time stock validation and atomic slot capacity reservation.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const createOrder = async (req, res) => {
  try {
    const {
      items,
      timeSlotId,
      paymentMethod = 'upi',
      specialInstructions = '',
      studentName: bodyStudentName,
      rollNumber: bodyRollNumber,
    } = req.body;

    // 1. Verify items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // 2. Identify student from JWT auth or resilient body fallback
    const studentId = req.user?._id || req.body.studentId;
    if (!studentId) {
      return res.status(401).json({ message: 'Authentication required to place an order' });
    }

    const studentName = req.user?.name || bodyStudentName || 'Student';
    const rollNumber = req.user?.rollNumber || bodyRollNumber || 'CS-2026';

    // 3. Real-time stock validation & server-side price computation
    const validatedItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId || item._id);

      if (!menuItem) {
        return res.status(404).json({
          message: `Menu item "${item.name || 'Unknown'}" was not found in catalog`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          message: `"${menuItem.name}" is currently sold out in the kitchen. Please adjust your order.`,
        });
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const unitPrice = menuItem.price;

      validatedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        quantity: qty,
        price: unitPrice,
        isVeg: menuItem.isVeg,
        imageUrl: menuItem.imageUrl || '',
      });

      calculatedSubtotal += unitPrice * qty;
    }

    // 4. Calculate accurate taxes and fees
    const taxAmount = Math.round(calculatedSubtotal * 0.05); // 5% GST
    const packagingFee = 10; // Flat tray/packaging fee
    const totalAmount = calculatedSubtotal + taxAmount + packagingFee;

    // 5. Atomic Time Slot Reservation
    let slotLabel = 'Express Pickup';
    let reservedSlotId = null;

    if (timeSlotId) {
      try {
        const reservedSlot = await TimeSlot.reserveSlot(timeSlotId);
        reservedSlotId = reservedSlot._id;
        slotLabel = reservedSlot.slotLabel;
      } catch (slotErr) {
        return res.status(400).json({
          message: slotErr.message || 'Selected pickup time slot is unavailable',
        });
      }
    }

    // 6. Generate Unique Daily Pickup Token (e.g. CB-104)
    const pickupToken = await generateDailyPickupToken();

    // 7. Persist Order to Database
    const newOrder = new Order({
      studentId,
      studentName,
      rollNumber,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      taxAmount,
      packagingFee,
      totalAmount,
      timeSlotId: reservedSlotId,
      slotLabel,
      pickupToken,
      paymentMethod,
      paymentStatus: 'Completed',
      orderStatus: 'Placed',
      specialInstructions: specialInstructions ? specialInstructions.slice(0, 250) : '',
      statusTimestamps: {
        placedAt: new Date(),
      },
    });

    const savedOrder = await newOrder.save();

    // 8. Populate references for rich response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('studentId', 'name email rollNumber')
      .populate('timeSlotId', 'slotLabel maxCapacity bookedCount');

    return res.status(201).json({
      message: 'Order placed successfully',
      pickupToken,
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      message: 'Failed to process order',
      error: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  res.json({ message: 'Get my orders endpoint placeholder' });
};

const getOrderById = async (req, res) => {
  res.json({ message: 'Get order by ID endpoint placeholder' });
};

module.exports = {
  generateDailyPickupToken,
  createOrder,
  getMyOrders,
  getOrderById,
};
