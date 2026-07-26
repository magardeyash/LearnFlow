<div align="center">

<img src="https://img.shields.io/badge/LearnFlow-LMS-22c55e?style=for-the-badge&logo=bookstack&logoColor=white" height="50"/>

# LearnFlow — Learning Management System

**A production-grade, full-stack LMS platform built with Spring Boot 3 and React 19.**  
Supports student enrollment, instructor course authoring, Razorpay payments, AWS S3 media uploads, and real-time learning progress tracking.

<br/>

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![AWS S3](https://img.shields.io/badge/AWS_S3-Presigned-FF9900?style=flat-square&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

<br/>

![License](https://img.shields.io/github/license/magardeyash/LearnFlow?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/magardeyash/LearnFlow?style=flat-square&color=22c55e)
![Repo Size](https://img.shields.io/github/repo-size/magardeyash/LearnFlow?style=flat-square)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## 🌐 Overview

LearnFlow is a full-stack Learning Management System (LMS) built to production-ready standards. It enables instructors to create and publish courses, students to discover, purchase, and learn from them — and administrators to verify instructor credentials and monitor platform health.

The system implements secure JWT authentication, email OTP verification, direct-to-S3 video and document uploads, and Razorpay-powered course purchases with server-side HMAC signature verification.

---

## ✨ Features

### 🎓 For Students
- Browse and search courses by category, difficulty level, and price
- Purchase individual courses via Razorpay (test & live modes)
- Add courses to cart and checkout in bulk
- Watch video lectures with automatic progress tracking
- Take auto-graded MCQ quizzes per lecture
- Self-evaluate with theory questions and model answers
- Download lecture PDF notes
- Participate in per-course discussion forums
- Apply to become an instructor (document upload flow)

### 🧑‍🏫 For Instructors
- Create and manage courses (title, description, thumbnail, level, pricing)
- Upload lecture videos and PDF notes directly to AWS S3
- Add MCQ and theory quizzes per lecture
- Toggle free preview for individual lessons
- Track student enrollment numbers and revenue

### 🛡️ For Admins
- View platform-wide statistics (students, instructors, courses, revenue)
- Review instructor applications (resume + ID proof)
- Approve or reject applicants with automated email notification

### 🔐 Authentication & Security
- JWT Bearer token authentication (stateless)
- Email OTP verification on registration
- Password reset via OTP (3-step flow)
- Google OAuth token verification
- Rate-limited OTP generation (max attempts + expiry)
- BCrypt password hashing

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.3.4 (Java 21) |
| Database | MongoDB (Spring Data MongoDB) |
| Security | Spring Security + JJWT 0.12.6 |
| Email | Spring Mail (SMTP / Gmail) |
| File Storage | AWS SDK v2 — S3 Presigned PUT URLs |
| Payments | Razorpay REST API (HMAC-SHA256 verification) |
| Google Auth | Google API Client + Http Client Gson |
| Rate Limiting | Bucket4j 8.10.1 |
| Build Tool | Maven |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 (custom dark theme) |
| State Management | Zustand 5 |
| Server State | TanStack Query v5 |
| Routing | React Router DOM v6 |
| Forms | React Hook Form + Zod validation |
| HTTP Client | Axios (with request/response interceptors) |
| Video Player | React Player |
| UI Utilities | Lucide React, clsx, tailwind-merge |
| Notifications | React Hot Toast |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│              React 19 + Vite 5 + TypeScript                 │
│         Zustand (state) │ TanStack Query (server state)     │
└────────────────────────┬────────────────────────────────────┘
                         │  REST API (JSON)
                         │  Authorization: Bearer <JWT>
┌────────────────────────▼────────────────────────────────────┐
│                  Spring Boot 3 Backend                       │
│                     (Port 8080)                              │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │  Controllers │  │   Services    │  │   Security Layer │  │
│  │  (REST API)  │→ │ (Business     │  │ JWT Filter       │  │
│  │              │  │  Logic)       │  │ BCrypt           │  │
│  └──────────────┘  └───────┬───────┘  └──────────────────┘  │
│                            │                                  │
│  ┌─────────────────────────▼──────────────────────────────┐  │
│  │              Spring Data MongoDB Repositories          │  │
│  └─────────────────────────┬──────────────────────────────┘  │
└────────────────────────────┼────────────────────────────────┘
                             │
         ┌───────────────────┼──────────────────────┐
         │                   │                      │
┌────────▼────────┐ ┌────────▼────────┐ ┌──────────▼────────┐
│    MongoDB      │ │    AWS S3       │ │   Razorpay API    │
│  (Collections)  │ │ (Media Storage) │ │   (Payments)      │
└─────────────────┘ └─────────────────┘ └───────────────────┘
```

---

## 📁 Project Structure

```
LearnFlow/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/learnflow/
│   │   ├── config/                   # Security, CORS, AWS S3 config beans
│   │   ├── controller/               # REST controllers (Auth, Course, Lesson…)
│   │   ├── dto/                      # Request/Response data transfer objects
│   │   ├── exception/                # Global exception handler
│   │   ├── model/                    # MongoDB @Document entity classes
│   │   ├── repository/               # MongoRepository interfaces
│   │   ├── security/                 # JWT util, filter, UserDetailsService
│   │   └── service/                  # Business logic services
│   └── src/main/resources/
│       └── application.properties    # Configuration (env-var driven)
│
├── frontend/                         # React + Vite Application
│   ├── src/
│   │   ├── api/                      # Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── common/               # Navbar, ProtectedRoute, S3FileUploader
│   │   │   └── ui/                   # Button, Card, Input, Modal, Badge…
│   │   ├── hooks/                    # TanStack Query custom hooks
│   │   ├── pages/
│   │   │   ├── admin/                # Admin dashboard
│   │   │   ├── auth/                 # Login, Register, OTP, Forgot Password
│   │   │   ├── instructor/           # Dashboard, Course & Quiz management
│   │   │   └── student/              # Browse, Course Detail, Viewer, Cart
│   │   ├── store/                    # Zustand stores (auth, cart, courseViewer)
│   │   └── types/                    # Shared TypeScript type definitions
│   └── tailwind.config.js
│
└── Walkthrough_Guide.md              # Local testing guide
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java 21+** — [Download](https://adoptium.net)
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 20+** — [Download](https://nodejs.org)
- **MongoDB 7** (local) — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Copy and configure environment variables (see Environment Variables section)
#    Set them in your system or create a .env and export before running

# 3. Build and run
mvn spring-boot:run
```

The server starts on **http://localhost:8080**

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Copy and configure frontend environment
cp .env.example .env
# Edit .env with your values

# 4. Start the development server
npm run dev
```

The app is available at **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend — `application.properties`

```properties
# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/learnflow

# JWT
jwt.secret=your-super-secret-key-at-least-32-chars-long

# Email (SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-gmail-app-password

# AWS S3
aws.s3.bucket=your-s3-bucket-name
aws.s3.region=us-east-1
aws.access.key=AKIAIOSFODNN7EXAMPLE
aws.secret.key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Razorpay
razorpay.key.id=rzp_test_xxxxxxxxxxxx
razorpay.key.secret=your_razorpay_key_secret

# Google OAuth
google.client.id=your-google-client-id.apps.googleusercontent.com
```

### Frontend — `.env`

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `POST` | `/api/auth/verify-email` | Verify email with OTP |
| `POST` | `/api/auth/send-otp` | Resend verification OTP |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP |
| `POST` | `/api/auth/reset-password` | Reset password with OTP |
| `POST` | `/api/auth/google` | Login via Google token |
| `POST` | `/api/auth/instructor-apply` | Submit instructor application |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/courses` | List/search published courses |
| `GET` | `/api/courses/:id` | Get course details |
| `GET` | `/api/courses/my` | Get instructor's courses |
| `POST` | `/api/courses` | Create a course |
| `PUT` | `/api/courses/:id` | Update a course |
| `DELETE` | `/api/courses/:id` | Delete a course |

### Lessons, Quizzes, Progress
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/lessons/course/:courseId` | Get lessons for a course |
| `POST` | `/api/lessons` | Create a lesson |
| `DELETE` | `/api/lessons/:id` | Delete a lesson |
| `GET` | `/api/quiz/lesson/:lessonId` | Get quiz for a lesson |
| `POST` | `/api/quiz` | Create/update quiz |
| `POST` | `/api/quiz/submit` | Submit MCQ answers for grading |
| `GET` | `/api/progress/:courseId` | Get student progress |
| `PATCH` | `/api/progress/update` | Update lesson progress |

### Payments & Cart
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payments/create-order` | Create Razorpay order |
| `POST` | `/api/payments/verify` | Verify payment signature |
| `GET` | `/api/cart` | Get cart contents |
| `POST` | `/api/cart/add` | Add course to cart |
| `DELETE` | `/api/cart/remove/:courseId` | Remove course from cart |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Platform statistics |
| `GET` | `/api/admin/pending-requests` | Pending instructor applications |
| `POST` | `/api/admin/verify-instructor` | Approve instructor |
| `POST` | `/api/admin/reject-instructor` | Reject instructor with reason |

---

## 👥 User Roles

| Role | Access Level |
|---|---|
| `STUDENT` | Browse, purchase, and learn courses; apply to become instructor |
| `INSTRUCTOR` | All student access + create/manage own courses and quizzes |
| `ADMIN` | Full access + platform stats, instructor approval/rejection |

> **First Admin Setup:** After registering, manually update the `role` field to `"ADMIN"` in MongoDB:
> ```javascript
> db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "ADMIN" } })
> ```

---

## 🗄 Data Models

The MongoDB database consists of **10 collections**:

| Collection | Description |
|---|---|
| `users` | All user accounts with role, enrollment list, verification status |
| `courses` | Course metadata, pricing, skill tags, publish status |
| `lessons` | Individual lecture records with video/notes S3 URLs |
| `quizzes` | MCQ and theory questions per lesson |
| `carts` | Per-user cart state with course ID list |
| `user_progress` | Per-user, per-course lesson completion tracking |
| `discussions` | Course discussion forum message threads |
| `pending_requests` | Instructor applications awaiting admin review |
| `otps` | Time-limited OTP codes for email verification and password reset |
| `payments` | Payment records with Razorpay order/payment IDs and status |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feat/your-feature-name`
5. **Open** a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org) for commit messages.

---

<div align="center">

Built with ❤️ by [Yash Magarde](https://github.com/magardeyash)

⭐ Star this repo if you found it useful!

</div>
