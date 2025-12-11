# 🏨 Vista Hotel Management System

<div align="center">

**Comprehensive Hotel Management System with Modern Technology**

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen?logo=spring)
![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![MariaDB](https://img.shields.io/badge/MariaDB-Latest-blue?logo=mariadb)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)

</div>

---

## Team Members - Group 11, DHKTPM18B Class

| No. | Full Name               |
| --- | ----------------------- |
| 1   | **Phan Phước Hiệp**     |
| 2   | **Huỳnh Thanh Giang**   |
| 3   | **Nguyễn Thị Mỹ Duyên** |
| 4   | **Hồ Quang Nhân**       |
| 5   | **Trần Long Vũ**        |
| 6   | **Trần Đoàn Khỏe**      |

---

## Project Overview

**Vista Hotel Management System** is a comprehensive hotel management solution designed to digitize and automate hotel operations. Built by Group 11 - DHKTPM18B class, this project applies the latest technologies and modern architecture patterns.

### Project Objectives

- **Comprehensive Management**: From booking, check-in/out, services to revenue reports
- **Automation**: AI Chatbot, automated emails, real-time notifications
- **High Security**: JWT Authentication, detailed authorization, data encryption
- **Multi-platform**: Responsive design, smooth operation across all devices
- **Smart Analytics**: Dashboard with charts and detailed reports

---

## Key Features

### Authentication & Authorization System

- **Multi-method Login**:
  - Email/Phone/Username + Password
  - OAuth 2.0 (Google, Facebook)
  - CAPTCHA security
- **3 User Roles**:
  - **Admin**: Full system management
  - **Employee**: Handle check-in/out, room management
  - **Customer**: Book rooms, use services
- **JWT Authentication**: Access token (24h) + Refresh token (7 days)
- **Password Recovery**: Automated password reset emails

### Booking Management

- **Smart Room Search**: By date, room type, price, amenities
- **Online Booking**: Select rooms, payment, receive vouchers
- **Walk-in Booking**: Front desk booking for walk-in guests
- **Shopping Cart**: Add multiple rooms, manage orders
- **Booking Management**: View history, details, cancel/modify
- **Flexible Policies**:
  - Early check-in (5:00-14:00)
  - Late check-out (12:00-23:59)
  - Time-based surcharges

### Room & Room Type Management

- **Room Management**: Add/edit/delete rooms, update status
- **Room Types**: Standard, Deluxe, Suite, VIP with different pricing
- **Room Status**: Available, Occupied, Cleaning, Maintenance
- **Room Change Requests**: Customers can request room transfers
- **Maintenance Tracking**: Track maintenance and repairs

### Promotions & Vouchers

- **Promotion Management**: Room type promotions, seasonal deals
- **Voucher System**:
  - Holiday vouchers (New Year, holidays)
  - Member vouchers (by membership tier)
  - Discount vouchers (percentage/amount off)
- **Customer Vouchers**: Auto-distribute, track usage
- **Seasonal Pricing**: Pricing by season (Peak, High, Normal, Low)

### Service Management

- **Service Catalog**: Dining, laundry, spa, gym, tours
- **Service Booking**: Book with room or standalone
- **Service Tracking**: Track status and payment

### Payment & Refunds

- **Payment Methods**:
  - Cash
  - Bank Transfer
  - E-Wallet
  - Credit Card
- **Booking Cancellation**: Cancel booking, automatic refunds
- **Refund Policy**: Flexible refund policies

### Reports & Analytics

- **Admin Dashboard**:
  - Revenue by day/month/year
  - Room occupancy rate
  - Top customers, employees
  - Visual charts
- **Revenue Reports**: Detailed revenue reports
- **Daily Statistics**: Daily work statistics
- **Export Reports**: Export to Excel, PDF

### AI & Chatbot

- **AI Concierge**: Virtual assistant for 24/7 customer support
- **Google Gemini Integration**: AI natural language processing
- **Chat Support**: Staff real-time chat with guests
- **WebSocket**: Real-time notifications and chat

### Email & Notifications

- **Email Automation**:
  - Booking confirmations
  - Password resets
  - Promotion announcements
  - Check-in/out reminders
- **Push Notifications**: Real-time notifications
- **SMS Integration**: Send OTP, notifications (optional)

### News Management

- **News Management**: CRUD news, promotions
- **Rich Text Editor**: TinyMCE WYSIWYG editor
- **Image Upload**: Cloudinary CDN
- **News Categories**: News categorization

### Customer & Employee Management

- **Customer Management**: Information, booking history
- **Employee Management**: Authorization, performance tracking
- **User Profile**: Update info, avatar, password
- **Customer Ranking**: Membership tiers (Bronze, Silver, Gold, Diamond)

### Check-in & Check-out

- **Digital Check-in**: QR code scanning, quick room assignment
- **Check-out**: Payment, invoice printing
- **Incident Report**: Report room incidents
- **Room Inspection**: Inspect rooms after check-out

### Reviews & Feedback

- **Review System**: Customer reviews after check-out
- **Rating**: 5-star ratings, comments
- **Reply Reviews**: Staff respond to reviews
- **Review Moderation**: Admin review approval

### Search & Filter

- **Advanced Search**: Search rooms by multiple criteria
- **Filter**: Filter by price, room type, amenities
- **Sort**: Sort by price, rating, name

---

## Technology Stack

### Backend

| Technology              | Version | Purpose                            |
| ----------------------- | ------- | ---------------------------------- |
| **Java**                | 21      | Primary programming language       |
| **Spring Boot**         | 3.5.6   | Backend framework                  |
| **Spring Security**     | 6.x     | Security & Authentication          |
| **Spring Data JPA**     | Latest  | ORM for MariaDB                    |
| **Spring Data MongoDB** | Latest  | NoSQL database                     |
| **Spring WebFlux**      | Latest  | Reactive programming               |
| **JWT (JJWT)**          | 0.12.6  | Token-based authentication         |
| **MariaDB**             | Latest  | Relational database                |
| **MongoDB Atlas**       | Cloud   | Document database (chat history)   |
| **Lombok**              | Latest  | Reduce boilerplate code            |
| **Maven**               | Latest  | Build tool & dependency management |
| **Google Gemini AI**    | Latest  | AI chatbot integration             |

### Frontend

| Technology         | Version  | Purpose                 |
| ------------------ | -------- | ----------------------- |
| **React**          | 19.1.1   | UI library              |
| **TypeScript**     | 5.9.3    | Type-safe JavaScript    |
| **Vite**           | 7.1.14   | Build tool & dev server |
| **React Router**   | 7.9.4    | Client-side routing     |
| **Axios**          | 1.12.2   | HTTP client             |
| **Tailwind CSS**   | 4.1.14   | Utility-first CSS       |
| **Framer Motion**  | 12.23.24 | Animation library       |
| **Recharts**       | 3.5.1    | Charting library        |
| **TinyMCE**        | 8.2.0    | Rich text editor        |
| **ExcelJS**        | 4.4.0    | Export Excel            |
| **jsPDF**          | 3.0.4    | Export PDF              |
| **React Toastify** | 11.0.5   | Toast notifications     |
| **Lucide React**   | 0.545.0  | Icon library            |
| **STOMP.js**       | 7.2.1    | WebSocket client        |
| **jwt-decode**     | 4.0.0    | JWT token decoding      |

### DevOps & Tools

- **Git**: Version control
- **GitHub**: Source code repository
- **Postman**: API testing
- **VS Code**: IDE
- **Maven Wrapper**: Build automation
- **ESLint**: Code linting
- **Prettier**: Code formatting

---

##System Architecture

### Overall Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │   Backend       │      │   Database      │
│   React + TS    │◄────►│  Spring Boot    │◄────►│  MariaDB        │
│   Port: 5173    │ REST │   Port: 8080    │ JPA  │  Port: 3306     │
└─────────────────┘ API  └─────────────────┘      └─────────────────┘
        │                         │                         │
        │                         │                         │
        ▼                         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Cloudinary    │      │   Google AI     │      │    MongoDB      │
│   Image CDN     │      │   Gemini API    │      │  Chat History   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Backend Architecture

```
backend/
├── controller/        # REST API endpoints
├── service/          # Business logic
├── repository/       # Data access layer
├── model/           # JPA entities
├── dto/             # Data transfer objects
├── config/          # Configuration classes
├── security/        # JWT, authentication
├── exception/       # Custom exceptions
├── scheduler/       # Scheduled tasks
└── util/            # Utility classes
```

### Frontend Architecture

```
frontend/
├── pages/           # Route components
│   ├── admin/      # Admin dashboard
│   ├── employee/   # Employee interface
│   ├── customer/   # Customer pages
│   └── auth/       # Login, register
├── components/      # Reusable components
├── layouts/        # Layout wrappers
├── services/       # API calls
├── context/        # React context
├── hooks/          # Custom hooks
├── types/          # TypeScript types
├── utils/          # Helper functions
└── routes/         # Route configuration
```

### Security Architecture

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │ 1. POST /auth/login
       ▼
┌──────────────────────────────────────────┐
│          AuthController                   │
│  - Validate credentials                   │
│  - Generate JWT (Access + Refresh)        │
└──────┬───────────────────────────────────┘
       │ 2. Return tokens
       ▼
┌──────────────┐
│   Client     │ Store in localStorage
│   (JWT)      │
└──────┬───────┘
       │ 3. API Request + Bearer Token
       ▼
┌──────────────────────────────────────────┐
│     JwtAuthenticationFilter               │
│  - Extract JWT from header               │
│  - Validate token signature              │
│  - Load user details                     │
└──────┬───────────────────────────────────┘
       │ 4. Valid token
       ▼
┌──────────────────────────────────────────┐
│     SecurityConfig                        │
│  - Check user role & permissions         │
│  - @PreAuthorize("hasRole('ADMIN')")     │
└──────┬───────────────────────────────────┘
       │ 5. Authorized
       ▼
┌──────────────────────────────────────────┐
│     Controller Method                     │
│  - Execute business logic                │
│  - Return response                       │
└──────────────────────────────────────────┘
```

---

## Installation & Deployment

### System Requirements

- **Java**: JDK 21 or higher
- **Node.js**: v20.x or higher
- **MariaDB**: 10.x or higher
- **MongoDB**: Atlas account (or local)
- **Maven**: 3.8+ (or use wrapper)
- **Git**: Latest version

<div align="center">

**Thank you for your interest in Vista Hotel Management System!**

Made with ❤️ by **Group 11 - DHKTPM18B**

</div>
