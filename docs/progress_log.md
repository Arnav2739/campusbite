# 📈 CampusBite - Project Progress & Changelog

This document tracks the end-to-end development progress, sprint milestones, and individual feature status across all team members for the CampusBite FSD project.

---

## 🚦 Overall Project Status: `Phase 2 Complete (All 6 Modules Merged & Functional)`

```text
[████████████████████████] 100% Feature Completion (Ready for Final QA & Viva)
```

- **Phase 1 (Lead Setup & Foundation):** ✅ 100% Completed
- **Phase 2 (Individual Feature Branches):** ✅ 100% Completed (All 6 members merged to `main`)
- **Phase 3 (Integration & QA Testing):** ⏳ In Progress (Build & Syntax Verified)
- **Phase 4 (Final Deployment & Documentation):** 📅 Scheduled

---

## 📅 Sprint Progress & Milestone Tracker

| Milestone | Target Date | Owner | Status | Key Deliverables |
|---|---|---|---|---|
| **M1: Monorepo Scaffolding & DevOps** | Sprint 1 | Pushkar | ✅ Completed | Docker MongoDB, `.env`, `.gitignore`, `start.bat` |
| **M2: Core Hubs Pre-Wiring** | Sprint 1 | Pushkar | ✅ Completed | `server.js` route mounts & `App.jsx` React Router hubs |
| **M3: Menu Catalog Module** | Sprint 1 | Pushkar | ✅ Completed | `MenuItem` schema, `/api/menu` CRUD, `MenuPage.jsx`, `FoodCard.jsx` |
| **M4: Database Seeder** | Sprint 1 | Pushkar | ✅ Completed | 16 menu items, 8 slots, 2 test users seeded |
| **M5: Auth Engine & Security** | Sprint 2 | Aditya | ✅ Completed | JWT auth, User schema, role guards, axios interceptor |
| **M6: Frontend Shell & Auth Flow** | Sprint 2 | Riya | ✅ Completed | `AuthContext`, `Navbar`, `LandingPage`, `LoginRegister`, `ProfileHistory` |
| **M7: Time Slots & Cart Engine** | Sprint 2 | Arnav | ✅ Completed | Slot capacity checks, `CartContext`, `CartDrawer`, `CheckoutPage` |
| **M8: Order Processing & Tracking** | Sprint 3 | Vedanti | ✅ Completed | Order creation, `CB-XXX` token generator, live progress stepper |
| **M9: Kitchen Queue & Analytics** | Sprint 3 | Anish | ✅ Completed | Kitchen queue Kanban, status updates, sales aggregation |
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
- **Progress:** 100% (Completed and merged to `main`)
- [x] Implement `server/models/User.js` with bcrypt password hashing
- [x] Implement `POST /api/auth/register` and `POST /api/auth/login`
- [x] Implement `GET /api/auth/me` profile endpoint
- [x] Build `authMiddleware.js` (`protect` and `staffOnly` guards)
- [x] Configure `client/src/api/axiosInstance.js` with automatic JWT header attachment

### 3. Riya (Frontend Auth Flow, Navigation Shell & History)
- **Branch:** `feat/riya-auth-ui`
- **Progress:** 100% (Completed across 9 Conventional Commits)
- [x] Build `client/src/context/AuthContext.jsx` with localStorage synchronization & reactive auth state
- [x] Build `client/src/components/ProtectedRoute.jsx` for role-based redirects & loading spinner
- [x] Build `client/src/components/Navbar.jsx` with dynamic user profile, cart count badge & mobile drawer
- [x] Build `client/src/pages/LandingPage.jsx` with hero banner, 4-step workflow, features & rush statistics
- [x] Build `client/src/pages/LoginRegister.jsx` with role selection tabs, validation & password strength meter
- [x] Build `client/src/pages/ProfileHistory.jsx` with order status filter tabs, spending stats & quick reorder

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
- **Progress:** 100% (Completed across 9 Conventional Commits)
- [x] Implement `server/models/Order.js` schema with item arrays and status enums
- [x] Implement `POST /api/orders` with atomic slot capacity decrement & unique daily `CB-XXX` token generator
- [x] Implement `GET /api/orders/my-orders` and `GET /api/orders/:id`
- [x] Implement `PATCH /api/orders/:id/cancel` with atomic slot capacity release
- [x] Build `client/src/components/OrderTokenBadge.jsx` pickup receipt card with QR code and copy token action
- [x] Build `client/src/pages/OrderTrackingPage.jsx` with 4-stage live polling stepper and 10s auto-refresh

### 6. Anish (Kitchen Dashboard, Analytics & QA Testing)
- **Branch:** `feat/anish-staff-dashboard`
- **Progress:** 100% (Completed across 3 Pull Requests & Merged to Main)
- [x] Implement `GET /api/staff/kitchen-queue` sorted by pickup slot
- [x] Implement `PATCH /api/staff/orders/:id/status` (Placed -> Preparing -> Ready -> Completed)
- [x] Implement `PATCH /api/staff/menu/:id/toggle` for kitchen stock management
- [x] Implement `GET /api/staff/analytics` with MongoDB `$match` and `$group` aggregation
- [x] Build `client/src/pages/StaffDashboard.jsx` (Live Kitchen Queue, Stock Manager, Sales KPIs)
- [x] Export `CampusBite_Staff_APIs.postman_collection.json` and finalize documentation

---

## 📝 Daily Change Log
 
### [2026-10-21] - Frontend Auth Shell, Navigation & Profile History Release
- **Author:** Riya
- **Branch:** `feat/riya-auth-ui`
- Delivered complete milestone M6 split cleanly across 9 atomic conventional commits (PR #9):
  1. `feat(auth-context)`: Built reactive `AuthContext` provider with `localStorage` token/user hydration and centralized login/logout handlers.
  2. `feat(protected-route)`: Implemented `ProtectedRoute` guard with role authorization checks (`student` vs `staff`) and loading spinner.
  3. `feat(navbar)`: Built responsive `Navbar.jsx` with dynamic role navigation, cart item badge counter, user dropdown profile menu, and mobile navigation drawer.
  4. `feat(landing-page)`: Built rich `LandingPage.jsx` with hero banner, 4-step ordering workflow, feature cards, and canteen rush indicators.
  5. `feat(login-register)`: Implemented tabbed `LoginRegister.jsx` with real-time validation, password strength meter, remember-me toggle, and role-based redirects (`/menu` vs `/staff-dashboard`).
  6. `feat(profile-history)`: Built `ProfileHistory.jsx` with student profile card, spending analytics, expandable order item trays, status filter tabs, and one-click reorder button.

### [2026-10-20] - JWT Authentication Engine, Security Middleware & API Client Release
- **Author:** Aditya
- **Branch:** `feat/aditya-auth-security`
- Delivered complete milestone M5 across 8 atomic conventional commits (PR #5):
  1. `feat(model)`: Enhanced Mongoose `User` schema with `bcryptjs` salt hashing pre-save hooks, `matchPassword` method, and avatar virtuals.
  2. `feat(auth)`: Implemented `POST /api/auth/register` validating college email/roll number and returning signed JWT token.
  3. `feat(auth)`: Implemented `POST /api/auth/login` credentials verification returning JWT and role payload.
  4. `feat(middleware)`: Built `protect` JWT Bearer token authentication middleware.
  5. `feat(auth)`: Implemented `staffOnly` role authorization guard and `GET /api/auth/me` profile lookup endpoint.
  6. `feat(client)`: Configured frontend `axiosInstance.js` with request Bearer interceptor and 401 response auto-logout interceptor.
  7. `feat(security)`: Added request input validation middleware and comprehensive global error middleware.

### [2026-10-20] - Order Processing Engine, Pickup Token & Live Tracking Release
- **Author:** Vedanti
- **Branch:** `feat/vedanti-orders-tracking`
- Delivered complete milestone M8 split cleanly across 9 atomic conventional commits:
  1. `feat(order-model)`: Enhanced Mongoose `Order` schema with subtotal, tax math, packaging fee, status lifecycle timestamps, and compound indexing for rapid kitchen queue retrieval.
  2. `feat(token-generator)`: Implemented daily unique `CB-XXX` token generator algorithm with calendar-day collision detection loops.
  3. `feat(order-api)`: Implemented `POST /api/orders` with catalog stock validation and atomic slot reservation via `TimeSlot.reserveSlot()` to prevent overbooking.
  4. `feat(order-api)`: Implemented `GET /api/orders/my-orders` for student history and `GET /api/orders/:id` for live polling lookup.
  5. `feat(order-routes)`: Wired all order endpoints with JWT `protect` middleware and order cancellation logic.
  6. `feat(token-badge)`: Built `OrderTokenBadge.jsx` digital canteen ticket pass with monospace token code, QR code simulation, and copy action.
  7. `feat(tracking-stepper)`: Developed 4-stage visual stepper (`Placed` → `Preparing` → `Ready` → `Completed`) with dynamic progress fill bar.
  8. `feat(tracking-polling)`: Implemented 10-second automated live polling, readiness alert banner, tray breakdown, and order cancellation.
  9. `docs(progress)`: Documented full milestone M8 completion, API endpoints, and changelog in `progress_log.md` and `api_reference.md`.

### [2026-10-20] - Staff Kitchen Queue, Stock Manager & Analytics Release
- **Author:** Anish
- **Branch:** `feat/anish-staff-dashboard`
- Delivered milestone M9 across 3 Pull Requests merged into `main`:
  1. `feat(staff)`: Implemented staff controller and route endpoints (`/api/staff/kitchen-queue`, `/api/staff/orders/:id/status`, `/api/staff/menu/:id/toggle`, `/api/staff/analytics`) with chronological queue sorting and sales metric aggregation.
  2. `feat(staff)`: Built responsive `StaffDashboard.jsx` featuring Kanban queue boards, 10s auto-refresh polling, forward status action triggers, stock management toggles, and daily sales KPI cards.
  3. `docs(staff)`: Exported `CampusBite_Staff_APIs.postman_collection.json` covering all staff endpoints with JWT environment variables for QA testing.

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

