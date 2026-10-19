// [Anish] staffController.js
// Handles: Kitchen Queue API, Status update PATCH, Menu stock toggle, Daily analytics
// Branch: feat/anish-staff-dashboard

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
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
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
// GET /api/staff/analytics
// Returns today's revenue, order counts, and top 5 selling items.
// "Today" is computed using midnight local time.
// ---------------------------------------------------------------------------
const getStaffAnalytics = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday },
      paymentStatus: 'Completed',
    });

    const totalOrders = todayOrders.length;
    const completedOrders = todayOrders.filter((o) => o.orderStatus === 'Completed').length;
    const pendingOrders = todayOrders.filter(
      (o) => o.orderStatus === 'Placed' || o.orderStatus === 'Preparing'
    ).length;
    const cancelledOrders = todayOrders.filter((o) => o.orderStatus === 'Cancelled').length;

    const todayRevenue = todayOrders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    // Aggregate item sell-count across all today's orders
    const itemCountMap = {};
    todayOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCountMap[item.name]) {
          itemCountMap[item.name] = 0;
        }
        itemCountMap[item.name] += item.quantity;
      });
    });

    const topSellingItems = Object.entries(itemCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.status(200).json({
      todayRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      cancelledOrders,
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
  getStaffAnalytics,
};
