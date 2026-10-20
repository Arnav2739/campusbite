# 📚 CampusBite - Complete API Reference Manual

Base URL: `http://localhost:5000/api`

---

## 1. Authentication APIs (Owner: Aditya)

### 1.1 Register User
- **Method:** `POST`
- **Endpoint:** `/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "name": "Riya Sharma",
  "email": "riya.student@campus.edu",
  "rollNumber": "CS2026-042",
  "password": "student123",
  "role": "student"
}
```
- **Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "671391234abcd",
    "name": "Riya Sharma",
    "email": "riya.student@campus.edu",
    "role": "student"
  }
}
```

---

### 1.2 User Login
- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "riya.student@campus.edu",
  "password": "student123"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "671391234abcd",
    "name": "Riya Sharma",
    "email": "riya.student@campus.edu",
    "role": "student"
  }
}
```

---

### 1.3 Get Current User Profile
- **Method:** `GET`
- **Endpoint:** `/auth/me`
- **Access:** Logged In (`Authorization: Bearer <token>`)
- **Response (200 OK):**
```json
{
  "_id": "671391234abcd",
  "name": "Riya Sharma",
  "email": "riya.student@campus.edu",
  "rollNumber": "CS2026-042",
  "role": "student"
}
```

---

## 2. Menu Catalog APIs (Owner: Pushkar)

### 2.1 Get All Menu Items (With Filters)
- **Method:** `GET`
- **Endpoint:** `/menu`
- **Access:** Public
- **Optional Query Parameters:**
  - `category` (e.g., `Snacks`, `Meals`, `Beverages`)
  - `isVeg` (`true` or `false`)
  - `search` (e.g., `samosa`)
- **Example:** `GET /api/menu?category=Snacks&isVeg=true&search=samosa`
- **Response (200 OK):**
```json
[
  {
    "_id": "67139a01bce23",
    "name": "Crispy Samosa (2 pcs)",
    "category": "Snacks",
    "price": 30,
    "isVeg": true,
    "isAvailable": true,
    "prepTime": 5,
    "imageUrl": "https://images.unsplash.com/photo-1601050690597-df0568f70950"
  }
]
```

---

### 2.2 Add New Food Item
- **Method:** `POST`
- **Endpoint:** `/menu`
- **Access:** Staff Only
- **Request Body:**
```json
{
  "name": "Paneer Kathi Roll",
  "category": "Snacks",
  "price": 75,
  "isVeg": true,
  "isAvailable": true,
  "imageUrl": "https://example.com/paneer-roll.jpg",
  "prepTime": 10
}
```
- **Response (201 Created):** Newly created MenuItem document.

---

## 3. Time Slot APIs (Owner: Arnav)

### 3.1 Get Pickup Time Slots & Remaining Capacity
- **Method:** `GET`
- **Endpoint:** `/slots`
- **Access:** Public / Logged In
- **Response (200 OK):**
```json
[
  {
    "_id": "67139b01fde45",
    "slotLabel": "12:15 PM - 12:30 PM",
    "maxCapacity": 30,
    "bookedCount": 22,
    "availableSpots": 8,
    "isActive": true
  }
]
```

---

## 4. Order Processing APIs (Owner: Vedanti)

### 4.1 Create Pre-Order
- **Method:** `POST`
- **Endpoint:** `/orders`
- **Access:** Student Only
- **Request Body:**
```json
{
  "timeSlotId": "67139b01fde45",
  "items": [
    {
      "menuItemId": "67139a01bce23",
      "name": "Crispy Samosa (2 pcs)",
      "quantity": 2,
      "price": 30
    }
  ],
  "totalAmount": 60,
  "paymentStatus": "Completed"
}
```
- **Response (201 Created):**
```json
{
  "_id": "67139c99fed11",
  "pickupToken": "CB-104",
  "orderStatus": "Placed",
  "totalAmount": 60,
  "timeSlotId": "67139b01fde45",
  "createdAt": "2026-10-19T13:30:00.000Z"
}
```

---

### 4.2 Get Logged-In Student's Orders
- **Method:** `GET`
- **Endpoint:** `/orders/my-orders`
- **Access:** Student Only
- **Response (200 OK):** Array of past and active orders sorted by `createdAt` descending.

---

### 4.3 Get Single Order Live Status (Polling)
- **Method:** `GET`
- **Endpoint:** `/orders/:id`
- **Access:** Student / Staff
- **Parameters:** `id` can be either MongoDB `_id` or `pickupToken` (e.g., `CB-104`)
- **Response (200 OK):**
```json
{
  "_id": "67139c99fed11",
  "pickupToken": "CB-104",
  "orderStatus": "Preparing",
  "totalAmount": 60,
  "slotLabel": "12:30 PM - 12:45 PM",
  "updatedAt": "2026-10-19T13:32:00.000Z"
}
```

---

### 4.4 Cancel Order (Releases Slot Capacity)
- **Method:** `PATCH`
- **Endpoint:** `/orders/:id/cancel`
- **Access:** Student (Order Owner)
- **Condition:** Order must strictly be in `'Placed'` status.
- **Request Body:**
```json
{
  "reason": "Need to attend laboratory lecture"
}
```
- **Response (200 OK):**
```json
{
  "message": "Order cancelled successfully and pickup spot released",
  "order": {
    "_id": "67139c99fed11",
    "orderStatus": "Cancelled",
    "pickupToken": "CB-104"
  }
}
```

---

## 5. Staff Kitchen & Analytics APIs (Owner: Anish)

### 5.1 Get Kitchen Queue
- **Method:** `GET`
- **Endpoint:** `/staff/kitchen-queue`
- **Access:** Staff Only
- **Response (200 OK):** Active orders (`Placed`, `Preparing`, `Ready`) sorted by `timeSlot` and `createdAt`.

---

### 5.2 Update Order Status
- **Method:** `PATCH`
- **Endpoint:** `/staff/orders/:id/status`
- **Access:** Staff Only
- **Request Body:**
```json
{
  "orderStatus": "Preparing"
}
```

---

### 5.3 Toggle Menu Item Availability
- **Method:** `PATCH`
- **Endpoint:** `/staff/menu/:id/toggle`
- **Access:** Staff Only
- **Response (200 OK):** Returns updated menu item with inverted `isAvailable`.

---

### 5.4 Daily Sales & Order Analytics
- **Method:** `GET`
- **Endpoint:** `/staff/analytics`
- **Access:** Staff Only
- **Response (200 OK):**
```json
{
  "todayRevenue": 14250,
  "totalOrders": 128,
  "completedOrders": 114,
  "pendingOrders": 14,
  "topSellingItems": [
    { "name": "Crispy Samosa (2 pcs)", "count": 64 },
    { "name": "Cold Coffee with Ice Cream", "count": 45 },
    { "name": "Special Veg Thali", "count": 32 }
  ]
}
```
