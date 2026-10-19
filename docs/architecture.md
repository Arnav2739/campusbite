# 🏛️ CampusBite - Architecture & Database Design

This document details the software architecture, data models, state machines, and authentication flow for CampusBite.

---

## 1. High-Level System Architecture

CampusBite follows a decoupled 3-tier client-server architecture:

```mermaid
graph TD
    Client["React.js Frontend (Vite + Tailwind)<br/>Port: 5173"]
    API["Express.js + Node.js Backend API<br/>Port: 5000"]
    DB[("MongoDB 7.0 Database<br/>Port: 27017")]
    AuthMiddleware["JWT Auth Guard<br/>protect & staffOnly"]

    Client -->|HTTP / JSON Requests| API
    API -->|Validates Token| AuthMiddleware
    AuthMiddleware -->|Authorized Queries| DB
    DB -->|Mongoose Documents| API
    API -->|JSON Responses| Client
```

---

## 2. Database Schema & Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ORDER : "places"
    TIMESLOT ||--o{ ORDER : "assigned to"
    MENUITEM ||--o{ ORDER_ITEM : "references"
    ORDER ||--|{ ORDER_ITEM : "contains"

    USER {
        ObjectId _id PK
        string name
        string email
        string rollNumber
        string passwordHash
        string role "student | staff"
        date createdAt
    }

    MENUITEM {
        ObjectId _id PK
        string name
        string category "Snacks | Meals | Beverages"
        number price
        boolean isVeg
        boolean isAvailable
        string imageUrl
        number prepTime "minutes"
        date createdAt
    }

    TIMESLOT {
        ObjectId _id PK
        string slotLabel "e.g. 12:30 PM - 12:45 PM"
        number maxCapacity "default: 25"
        number bookedCount "default: 0"
        boolean isActive
    }

    ORDER {
        ObjectId _id PK
        ObjectId studentId FK
        ObjectId timeSlotId FK
        string pickupToken "e.g. CB-104"
        number totalAmount
        string paymentStatus "Pending | Completed | Failed"
        string orderStatus "Placed | Preparing | Ready | Completed | Cancelled"
        date createdAt
    }

    ORDER_ITEM {
        ObjectId menuItemId FK
        string name
        number quantity
        number price
    }
```

---

## 3. Order Lifecycle State Machine

Each canteen order transitions through deterministic states tracked in real-time by students and staff:

```mermaid
stateDiagram-v2
    [*] --> Placed: Student checks out & pays
    Placed --> Preparing: Chef clicks 'Start Preparing' in Kitchen
    Preparing --> Ready: Food packaged, badge turns Green
    Ready --> Completed: Student presents CB-XXX token & collects food
    Placed --> Cancelled: Staff cancels out-of-stock order
    Preparing --> Cancelled: Emergency kitchen cancellation
    Completed --> [*]
    Cancelled --> [*]
```

---

## 4. Authentication & Role-Based Access Flow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    actor Staff
    participant Frontend as React Client
    participant Server as Express Backend
    participant DB as MongoDB

    Student->>Frontend: Submit credentials (email, password)
    Frontend->>Server: POST /api/auth/login
    Server->>DB: Query User & verify bcrypt hash
    DB-->>Server: User record found
    Server->>Server: Generate JWT token signed with JWT_SECRET
    Server-->>Frontend: Return { token, user: { name, role: 'student' } }
    Frontend->>Frontend: Save token in localStorage & update AuthContext
    Frontend->>Frontend: Redirect student to /menu

    Staff->>Frontend: Submit staff credentials
    Frontend->>Server: POST /api/auth/login
    Server-->>Frontend: Return { token, user: { name, role: 'staff' } }
    Frontend->>Frontend: Redirect staff to /staff-dashboard
```
