// [Anish] staffController.js
// Handles: Kitchen Queue API, Status update PATCH, Menu stock toggle,
//          Staff menu list, Daily analytics (MongoDB aggregation pipeline)
// Branch: feat/anish-staff-dashboard
// Updated: uses statusTimestamps + $group aggregation after teammates' model enhancements

const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// ---------------------------------------------------------------------------
// GET /api/staff/kitchen-queue
// Returns all active orders (Placed | Preparing | Ready) sorted by timeSlot
// then createdAt — so staff see oldest/highest-priority orders first.
// ---------------------------------------------------------------------------
const getKitchenQueue = async (req, res) => {
  try {
    const activeOrders = await Order.find({
      orderStatus: { $in: ['Placed', 'Preparing', 'Ready'] },
    })
      .populate('studentId', 'name rollNumber')
      .populate('timeSlotId', 'slotLabel')
      .sort({ timeSlotId: 1, createdAt: 1 });

    res.status(200).json(activeOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch kitchen queue', error: error.message });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/staff/orders/:id/status
// Staff can move an order through: Placed → Preparing → Ready → Completed
// or mark it Cancelled. Only valid enum values are accepted.
// ---------------------------------------------------------------------------
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const VALID_STATUSES = ['Placed', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  if (!orderStatus || !VALID_STATUSES.includes(orderStatus)) {
    return res.status(400).json({
      message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`,
    });
  }

  try {
    // Build timestamp update — stamp the exact time for each lifecycle stage
    const now = new Date();
    const timestampField = {
      Preparing: 'statusTimestamps.preparingAt',
      Ready: 'statusTimestamps.readyAt',
      Completed: 'statusTimestamps.completedAt',
      Cancelled: 'statusTimestamps.cancelledAt',
    }[orderStatus];

    const updatePayload = { orderStatus };
    if (timestampField) updatePayload[timestampField] = now;

    const order = await Order.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).populate('studentId', 'name rollNumber');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/staff/menu/:id/toggle
// Toggles the isAvailable flag on a MenuItem.
// Staff use this to instantly mark items as sold-out or back in stock.
// ---------------------------------------------------------------------------
const toggleMenuItemStock = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await MenuItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.status(200).json({
      message: `"${item.name}" is now ${item.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}`,
      menuItem: item,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle item stock', error: error.message });
  }
};

// ---------------------------------------------------------------------------
// GET /api/staff/menu
// Returns all menu items for the staff stock management panel.
// Staff use this to see what's available and toggle stock status.
// ---------------------------------------------------------------------------
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({}).sort({ category: 1, name: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
};

// ---------------------------------------------------------------------------
// GET /api/staff/analytics
// Returns today's revenue, order counts, and top 5 selling items.
// Uses MongoDB $group aggregation pipeline — efficient even at scale.
// ---------------------------------------------------------------------------
const getStaffAnalytics = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // ── Step 1: order-level stats via $group ──────────────────────────────
    const [orderStats] = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          paymentStatus: 'Completed',
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          todayRevenue: {
            $sum: {
              $cond: [
                { $ne: ['$orderStatus', 'Cancelled'] },
                '$totalAmount',
                0,
              ],
            },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Completed'] }, 1, 0] },
          },
          pendingOrders: {
            $sum: {
              $cond: [
                { $in: ['$orderStatus', ['Placed', 'Preparing']] },
                1,
                0,
              ],
            },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0] },
          },
        },
      },
    ]);

    // ── Step 2: item-level sell counts via $unwind + $group ───────────────
    const topSellingItems = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          paymentStatus: 'Completed',
          orderStatus: { $ne: 'Cancelled' },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          count: { $sum: '$items.quantity' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: '$_id', count: 1 } },
    ]);

    res.status(200).json({
      todayRevenue: orderStats?.todayRevenue || 0,
      totalOrders: orderStats?.totalOrders || 0,
      completedOrders: orderStats?.completedOrders || 0,
      pendingOrders: orderStats?.pendingOrders || 0,
      cancelledOrders: orderStats?.cancelledOrders || 0,
      topSellingItems,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

module.exports = {
  getKitchenQueue,
  updateOrderStatus,
  toggleMenuItemStock,
  getMenuItems,
  getStaffAnalytics,
};
