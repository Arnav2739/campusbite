# CampusBite - Campus Canteen Pre-Ordering System

CampusBite is a full-stack campus canteen pre-ordering application designed to streamline food ordering, reduce wait times during peak hours, and simplify kitchen order dispatching for canteen staff.

---

## 👥 Team Members & Contribution Breakdown

| Member | Role & Module | Responsibilities |
|---|---|---|
| **Pushkar (Lead)** | DevOps, Catalog & Maintainer | Repo scaffolding, Docker, MongoDB connection, Menu schema, Menu CRUD & filter APIs, Menu UI & FoodCard |
| **Aditya** | Backend Auth & Security | User schema (bcrypt hashing), JWT authentication (`/register`, `/login`, `/me`), auth middleware, axios interceptor |
| **Riya** | Frontend Auth & Navigation | AuthContext, ProtectedRoute, Navbar, LandingPage, LoginRegister tabs, ProfileHistory & Quick Reorder |
| **Arnav** | Time Slots & Shopping Cart | TimeSlot schema, slot capacity API, CartContext, CartDrawer component, CheckoutPage with slot picker |
| **Vedanti** | Orders & Live Tracking | Order schema, Order placement API with `CB-XXX` token generator, student orders API, OrderTokenBadge, OrderTrackingPage |
| **Anish** | Staff Dashboard & Analytics | Staff kitchen queue API, order status update, stock toggle API, sales aggregation analytics, StaffDashboard UI, Postman suite |

---

## 🏗️ System Architecture & Monorepo Structure

```text
campusbite/
├── docker-compose.yml                  # [Pushkar] MongoDB + Mongo-Express setup
├── .env.example                        # [Pushkar] Shared environment template
├── .gitignore                          # [Pushkar] Ignores node_modules & .env
├── README.md                           # Team documentation & API contract
│
├── server/                             # BACKEND (Node.js + Express + Mongoose)
│   ├── package.json                    # Express, Mongoose, JWT, bcrypt, cors
│   ├── server.js                       # Pre-mounts all 5 route files
│   ├── config/
│   │   └── db.js                       # Mongoose connection logic
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification & role guard
│   │   └── errorMiddleware.js          # Global error handler
│   ├── models/
│   │   ├── User.js                     # Student/Staff schema
│   │   ├── MenuItem.js                 # Food catalog schema
│   │   ├── TimeSlot.js                 # Pickup slot & capacity schema
│   │   └── Order.js                    # Order items, token & status schema
│   ├── controllers/
│   │   ├── authController.js           # Register, login, profile logic
│   │   ├── menuController.js           # Menu CRUD & availability toggle
│   │   ├── slotController.js           # Slot listing & capacity checks
│   │   ├── orderController.js          # Create order, generate token, student orders
│   │   └── staffController.js          # Kitchen queue, status update, daily analytics
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth/*
│   │   ├── menuRoutes.js               # /api/menu/*
│   │   ├── slotRoutes.js               # /api/slots/*
│   │   ├── orderRoutes.js              # /api/orders/*
│   │   └── staffRoutes.js              # /api/staff/*
│   └── seed/
│       └── seed.js                     # Pre-populates users, menu, and slots
│
└── client/                             # FRONTEND (React + Vite + Tailwind CSS)
    ├── package.json                    # React, React-Router, Axios, Lucide-React
    └── src/
        ├── App.jsx                     # Pre-wires all routes & Context providers
        ├── api/
        │   └── axiosInstance.js        # Axios config with automatic JWT header
        ├── context/
        │   ├── AuthContext.jsx         # User login state & localStorage sync
        │   └── CartContext.jsx         # Cart items, quantity math & slot state
        ├── components/
        │   ├── Navbar.jsx              # Role-aware top navigation bar
        │   ├── ProtectedRoute.jsx      # Redirects unauthenticated users
        │   ├── FoodCard.jsx            # Individual menu item card with "Add" button
        │   ├── CartDrawer.jsx          # Slide-out cart summary & quantity controls
        │   └── OrderTokenBadge.jsx     # Styled 4-digit token visual component
        └── pages/
            ├── LandingPage.jsx         # Hero banner & campus canteen intro
            ├── LoginRegister.jsx       # Tabbed Student/Staff auth form
            ├── ProfileHistory.jsx      # Student info & past completed orders
            ├── MenuPage.jsx            # Category tabs, Veg/Non-Veg toggle, search
            ├── CheckoutPage.jsx        # Time slot picker & Mock UPI/Card payment
            ├── OrderTrackingPage.jsx   # Live progress bar (Placed -> Ready)
            └── StaffDashboard.jsx      # Kitchen queue, stock toggles & sales summary
```

---

## 📋 Shared API Contract Table

| Endpoint | Method | Access | Owner | Purpose |
|---|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Aditya | Register student/staff & return JWT |
| `/api/auth/login` | `POST` | Public | Aditya | Authenticate user & return JWT + role |
| `/api/auth/me` | `GET` | Logged In | Aditya | Get current user profile |
| `/api/menu` | `GET` | Public | Pushkar | List all menu items (supports category/veg filters) |
| `/api/menu` | `POST` | Staff Only | Pushkar | Add a new food item to canteen catalog |
| `/api/slots` | `GET` | Logged In | Arnav | List pickup time slots with remaining capacity |
| `/api/orders` | `POST` | Student | Vedanti | Place order, decrement slot, return `CB-XXX` token |
| `/api/orders/my-orders` | `GET` | Student | Vedanti | Get logged-in student's active & past orders |
| `/api/orders/:id` | `GET` | Student | Vedanti | Poll live status of a specific order |
| `/api/staff/kitchen-queue` | `GET` | Staff Only | Anish | Fetch all active orders grouped by pickup slot |
| `/api/staff/orders/:id/status` | `PATCH` | Staff Only | Anish | Update status (`Preparing`, `Ready`, `Completed`) |
| `/api/staff/menu/:id/toggle` | `PATCH` | Staff Only | Anish | Toggle food item `isAvailable` stock status |
| `/api/staff/analytics` | `GET` | Staff Only | Anish | Daily sales revenue, order counts & top items |

---

## 🚀 Quick Setup & Run Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/) or local MongoDB instance

### 2. Database Setup
Start MongoDB using Docker:
```bash
docker compose up -d
```
*(Alternatively, run a local MongoDB instance on port 27017).*

### 3. Backend Setup
```bash
cd server
cp .env.example .env
npm install
npm run seed     # Seeds demo users, menu items, and time slots
npm run dev      # Runs Express server at http://localhost:5000
```

### 4. Frontend Setup
```bash
cd ../client
npm install
npm run dev      # Runs Vite dev server at http://localhost:5173
```
