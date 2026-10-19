# 📈 CampusBite - Project Progress & Changelog

This document tracks the end-to-end development progress, sprint milestones, and individual feature status across all team members for the CampusBite FSD project.

---

## 🚦 Overall Project Status: `Phase 1 Complete (Foundation & Menu Module)`

```text
[████████████░░░░░░░░░░░░] 40% Total Project Completion
```

- **Phase 1 (Lead Setup & Foundation):** ✅ 100% Completed
- **Phase 2 (Individual Feature Branches):** ⏳ In Progress
- **Phase 3 (Integration & QA Testing):** 📅 Scheduled
- **Phase 4 (Final Deployment & Documentation):** 📅 Scheduled

---

## 📅 Sprint Progress & Milestone Tracker

| Milestone | Target Date | Owner | Status | Key Deliverables |
|---|---|---|---|---|
| **M1: Monorepo Scaffolding & DevOps** | Sprint 1 | Pushkar | ✅ Completed | Docker MongoDB, `.env`, `.gitignore`, `start.bat` |
| **M2: Core Hubs Pre-Wiring** | Sprint 1 | Pushkar | ✅ Completed | `server.js` route mounts & `App.jsx` React Router hubs |
| **M3: Menu Catalog Module** | Sprint 1 | Pushkar | ✅ Completed | `MenuItem` schema, `/api/menu` CRUD, `MenuPage.jsx`, `FoodCard.jsx` |
| **M4: Database Seeder** | Sprint 1 | Pushkar | ✅ Completed | 16 menu items, 8 slots, 2 test users seeded |
| **M5: Auth Engine & Security** | Sprint 2 | Aditya | ⏳ In Progress | JWT auth, User schema, role guards, axios interceptor |
| **M6: Frontend Shell & Auth Flow** | Sprint 2 | Riya | ⏳ In Progress | `AuthContext`, `Navbar`, `LandingPage`, `LoginRegister` |
| **M7: Time Slots & Cart Engine** | Sprint 2 | Arnav | ✅ Completed | Slot capacity checks, `CartContext`, `CartDrawer`, `CheckoutPage` |
| **M8: Order Processing & Tracking** | Sprint 3 | Vedanti | ⏳ Scheduled | Order creation, `CB-XXX` token generator, live progress stepper |
| **M9: Kitchen Queue & Analytics** | Sprint 3 | Anish | ⏳ Scheduled | Kitchen queue Kanban, status updates, sales aggregation |
| **M10: Postman Testing & Project Review** | Sprint 4 | Team | 📅 Scheduled | Postman test suite, final slides, and viva preparation |

---

## 👤 Member-by-Member Contribution Progress

### 1. Pushkar (Project Lead, DevOps & Menu Catalog)
- **Branch:** `main` / `feat/pushkar-menu-module`
- **Progress:** 100%
- [x] Initialized monorepo with `server/` and `client/`
- [x] Configured `docker-compose.yml` for MongoDB 7.0
- [x] Pre-wired `server/server.js` and `client/src/App.jsx` with placeholders for all teammates
- [x] Implemented `server/models/MenuItem.js` schema
- [x] Implemented `server/controllers/menuController.js` and `menuRoutes.js` (category, veg, search filters)
- [x] Implemented `server/seed/seed.js` script (`npm run seed`)
- [x] Built `client/src/components/FoodCard.jsx` with stock badges and quantity controls
- [x] Built `client/src/pages/MenuPage.jsx` with dietary toggle, category pills, and live search
- [x] Created `start.bat` one-click launcher and `requirements.txt`
- [x] Completed and pushed 8 atomic conventional commits to `main`

### 2. Aditya (Backend Authentication, Security & API Client)
- **Branch:** `feat/aditya-auth-security`
- **Progress:** 0% (Scaffolded Starter Ready)
- [ ] Implement `server/models/User.js` with bcrypt password hashing
- [ ] Implement `POST /api/auth/register` and `POST /api/auth/login`
- [ ] Implement `GET /api/auth/me` profile endpoint
- [ ] Build `authMiddleware.js` (`protect` and `staffOnly` guards)
- [ ] Configure `client/src/api/axiosInstance.js` with automatic JWT header attachment

### 3. Riya (Frontend Auth Flow, Navigation Shell & History)
- **Branch:** `feat/riya-auth-ui`
- **Progress:** 0% (Scaffolded Starter Ready)
- [ ] Build `client/src/context/AuthContext.jsx` with localStorage synchronization
- [ ] Build `client/src/components/ProtectedRoute.jsx` for role-based redirects
- [ ] Build `client/src/components/Navbar.jsx` with dynamic user profile & cart count badge
- [ ] Build `client/src/pages/LandingPage.jsx` with hero banner and rush statistics
- [ ] Build `client/src/pages/LoginRegister.jsx` with role selection tabs
- [ ] Build `client/src/pages/ProfileHistory.jsx` with past completed orders and quick reorder

### 4. Arnav (Time Slots Engine, Cart & Checkout)
- **Branch:** `feat/arnav-slots-checkout`
- **Progress:** 100% (Completed across 10 Conventional Commits)
- [x] Implement `server/models/TimeSlot.js` with capacity tracking & atomic reservation
- [x] Implement `GET /api/slots` returning real-time available spots & urgency badges
- [x] Build `client/src/context/CartContext.jsx` with localStorage persistence & price calculation
- [x] Build `client/src/components/CartDrawer.jsx` slide-over component with quantity steppers & bill summary
- [x] Build `client/src/pages/CheckoutPage.jsx` with 15-minute slot picker, mock UPI/Wallet payment & token receipt

### 5. Vedanti (Order Processing Engine, Pickup Token & Tracking)
- **Branch:** `feat/vedanti-orders-tracking`
- **Progress:** 0% (Scaffolded Starter Ready)
- [ ] Implement `server/models/Order.js` schema with item arrays and status enums
- [ ] Implement `POST /api/orders` with atomic slot capacity decrement & `CB-XXX` token generator
- [ ] Implement `GET /api/orders/my-orders` and `GET /api/orders/:id`
- [ ] Build `client/src/components/OrderTokenBadge.jsx` pickup receipt card
- [ ] Build `client/src/pages/OrderTrackingPage.jsx` with 4-stage live polling stepper

### 6. Anish (Kitchen Dashboard, Analytics & QA Testing)
- **Branch:** `feat/anish-staff-dashboard`
- **Progress:** 0% (Scaffolded Starter Ready)
- [ ] Implement `GET /api/staff/kitchen-queue` sorted by pickup slot
- [ ] Implement `PATCH /api/staff/orders/:id/status` (Placed -> Preparing -> Ready -> Completed)
- [ ] Implement `PATCH /api/staff/menu/:id/toggle` for kitchen stock management
- [ ] Implement `GET /api/staff/analytics` with MongoDB `$match` and `$group` aggregation
- [ ] Build `client/src/pages/StaffDashboard.jsx` (Live Kitchen Queue, Stock Manager, Sales KPIs)
- [ ] Export `CampusBite.postman_collection.json` and finalize documentation

---

## 📝 Daily Change Log

### [2026-10-19] - Time Slots Engine, Cart & Checkout Release
- **Author:** Arnav
- **Branch:** `feat/arnav-slots-checkout`
- Delivered complete milestone M7 split cleanly across 10 atomic conventional commits:
  1. `feat(slots-model)`: Enhanced `TimeSlot` schema with virtual `availableSpots`, `isFull`, and atomic reservation/release methods to prevent overbooking.
  2. `feat(slots-controller)`: Implemented `slotController.js` computing capacity, urgency statuses (`available`, `filling-fast`, `full`), and resilient offline fallback data.
  3. `feat(slots-routes)`: Mounted `/api/slots`, `/api/slots/test`, and `/api/slots/:id` onto Express router.
  4. `feat(cart-context)`: Built core cart state management (`addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`).
  5. `feat(cart-storage)`: Added `localStorage` persistence, drawer visibility toggles, and financial price math (Subtotal, GST 5%, Tray fee, Grand Total).
  6. `feat(cart-ui)`: Created slide-over `CartDrawer` with backdrop blur, scroll locking, and Escape key dismissal.
  7. `feat(cart-items)`: Built item list cards with thumbnails, dietary dots, quantity steppers, itemized bill breakdown, and empty tray prompt.
  8. `feat(checkout-slots)`: Developed interactive 15-minute pickup slot grid in `CheckoutPage.jsx` with real-time capacity badges.
  9. `feat(checkout-payment)`: Implemented mock payment modal (UPI QR, Campus Wallet, Card), 1.5s simulated processing spinner, and digital pickup token receipt card.
  10. `docs(progress)`: Documented full milestone M7 completion and changelog in `progress_log.md`.

### [2026-10-19] - Initial Repository Scaffolding & Phase 1 Release
- **Author:** Pushkar (Lead)
- Created project folder structure with separate `server/` and `client/` directories.
- Configured MongoDB 7.0 via `docker-compose.yml`.
- Pre-mounted 5 route hubs in `server/server.js` and 7 page routes in `client/src/App.jsx`.
- Scaffolded empty starter files for Aditya, Riya, Arnav, Vedanti, and Anish.
- Implemented `MenuItem` schema, database config, and database seeder (`seed.js`).
- Implemented `GET /api/menu` with category, dietary, and search filters, plus `POST /api/menu`.
- Implemented `FoodCard.jsx` and `MenuPage.jsx` frontend components with Tailwind CSS.
- Created `start.bat` automated runner and `requirements.txt` onboarding guide.
- Pushed initial 8 atomic conventional commits to `main` branch.

