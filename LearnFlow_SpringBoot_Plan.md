# 🚀 LearnFlow — Spring Boot Edition
> **Rebuilding EduCore LMS from scratch** — React frontend + Spring Boot backend

---

## 📌 Project Overview

| Property | EduCore (Original) | LearnFlow (Spring Boot) |
|---|---|---|
| **Name** | EduCore | **LearnFlow** |
| **Frontend** | React + Vite | **React + Vite** |
| **Styling** | Tailwind CSS v4 | **Tailwind CSS v3** |
| **State** | Zustand | **Zustand + TanStack Query** |
| **Backend** | Node.js + Express | **Java 21 + Spring Boot 3.x** |
| **DB** | MongoDB + Mongoose | **MongoDB + Spring Data MongoDB** |
| **Auth** | JWT + Cookies | **Spring Security + JWT + Google OAuth2** |
| **OTP / Email** | Nodemailer | **JavaMailSender (Spring Mail)** |
| **Payments** | Razorpay | **Razorpay (REST API via RestTemplate)** |
| **File Storage** | AWS S3 | **AWS S3 (AWS SDK for Java v2)** |
| **Google OAuth** | google-auth-library | **google-api-client (token verify)** |
| **Deployment** | Express static serve | **Spring Boot JAR + React on Netlify/Render** |

---

## 🏗️ Project Structure

```
learnflow/
├── frontend/                        # React + Vite app
│   ├── public/
│   └── src/
│       ├── api/                     # Axios instance + API calls
│       ├── assets/
│       ├── components/
│       │   ├── auth/
│       │   ├── student/
│       │   ├── instructor/
│       │   ├── admin/
│       │   ├── common/
│       │   └── ui/                  # Reusable design system
│       ├── hooks/                   # Custom React hooks
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx
│       │   │   ├── RegisterPage.tsx
│       │   │   ├── VerifyEmailPage.tsx
│       │   │   └── ForgotPasswordPage.tsx
│       │   ├── student/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Browse.tsx
│       │   │   ├── CourseDetail.tsx
│       │   │   └── CourseViewer.tsx
│       │   ├── instructor/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── CourseManagement.tsx
│       │   │   ├── QuizManagement.tsx
│       │   │   └── InstructorRegister.tsx
│       │   ├── admin/
│       │   │   └── Dashboard.tsx
│       │   └── Unauthorized.tsx
│       ├── store/                   # Zustand stores
│       ├── types/                   # TypeScript interfaces
│       ├── utils/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
└── backend/                         # Spring Boot app
    └── src/main/java/com/learnflow/
        ├── LearnFlowApplication.java
        ├── config/
        │   ├── MongoConfig.java
        │   ├── SecurityConfig.java
        │   ├── CorsConfig.java
        │   ├── AwsS3Config.java
        │   └── RazorpayConfig.java
        ├── controller/
        │   ├── AuthController.java
        │   ├── CourseController.java
        │   ├── LessonController.java
        │   ├── QuizController.java
        │   ├── CartController.java
        │   ├── ProgressController.java
        │   ├── DiscussionController.java
        │   ├── PaymentController.java
        │   ├── AdminController.java
        │   └── UploadController.java
        ├── service/
        │   ├── AuthService.java
        │   ├── OtpService.java
        │   ├── EmailService.java
        │   ├── CourseService.java
        │   ├── LessonService.java
        │   ├── QuizService.java
        │   ├── CartService.java
        │   ├── ProgressService.java
        │   ├── DiscussionService.java
        │   ├── PaymentService.java
        │   ├── AdminService.java
        │   └── S3Service.java
        ├── repository/
        │   ├── UserRepository.java
        │   ├── CourseRepository.java
        │   ├── LessonRepository.java
        │   ├── QuizRepository.java
        │   ├── CartRepository.java
        │   ├── UserProgressRepository.java
        │   ├── DiscussionRepository.java
        │   ├── PendingRequestRepository.java
        │   ├── OtpRepository.java
        │   └── PaymentRepository.java
        ├── model/
        │   ├── User.java
        │   ├── Course.java
        │   ├── Lesson.java
        │   ├── Quiz.java
        │   ├── Cart.java
        │   ├── UserProgress.java
        │   ├── Discussion.java
        │   ├── PendingRequest.java
        │   ├── Otp.java
        │   └── Payment.java
        ├── dto/
        │   ├── request/
        │   └── response/
        ├── security/
        │   ├── JwtUtil.java
        │   ├── JwtAuthFilter.java
        │   └── UserDetailsServiceImpl.java
        ├── exception/
        │   ├── GlobalExceptionHandler.java
        │   └── CustomExceptions.java
        └── util/
            └── AppUtils.java
    └── src/main/resources/
        └── application.properties
```

---

## 📦 Tech Stack & Dependencies

### Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "zustand": "^5.x",
    "@tanstack/react-query": "^5.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "react-hot-toast": "^2.x",
    "framer-motion": "^11.x",
    "react-player": "^2.x",
    "lucide-react": "latest",
    "react-icons": "^5.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-progress": "latest",
    "@radix-ui/react-tabs": "latest"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.4.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

### Backend (`pom.xml` — Maven)
```
spring-boot-starter-web
spring-boot-starter-data-mongodb
spring-boot-starter-security
spring-boot-starter-mail
spring-boot-starter-validation
io.jsonwebtoken:jjwt-api:0.12.x
io.jsonwebtoken:jjwt-impl:0.12.x
io.jsonwebtoken:jjwt-jackson:0.12.x
software.amazon.awssdk:s3:2.x
com.google.api-client:google-api-client:2.x
com.github.vladimir-bukhtoyarov:bucket4j-core:8.x
org.projectlombok:lombok
spring-boot-starter-test
```

> Razorpay: no official Maven SDK — use RestTemplate with Basic Auth to call their REST API.

---

## 🗄️ MongoDB Models (Spring Data)

### 1. User
```
@Document("users")
id, name, email (unique indexed), password,
role: enum[STUDENT, INSTRUCTOR, ADMIN] default=STUDENT,
isVerified: boolean default=false,
enrolledCourses: List<String> default=[],
avatar: String default="",
createdAt, updatedAt (audited)
```

### 2. Course
```
@Document("courses")
id, title, slug (unique), thumbnail,
instructorId (ref User), description,
skills: List<String>, lessonIds: List<String>,
price: double, totalEnrolledStudents: int default=0,
category, level: enum[BEGINNER, INTERMEDIATE, ADVANCED],
isPublished: boolean default=false, rating: double default=0,
createdAt, updatedAt
```

### 3. Lesson
```
@Document("lessons")
id, courseId, title, videoUrl, notesUrl,
quizId (nullable), description,
duration: int (minutes), order: int, isFree: boolean,
createdAt
```

### 4. Quiz
```
@Document("quizzes")
id, lessonId,
mcqs: List<Mcq { question, options: List<String>, correctIndex: int }>,
theoryQuestions: List<TheoryQuestion { question, answer }>,
createdAt
```

### 5. Cart
```
@Document("carts")
id, userId (unique indexed), courseIds: List<String>, updatedAt
```

### 6. UserProgress
```
@Document("user_progress")
@CompoundIndex({ courseId: 1, userId: 1 }, unique=true)
id, courseId, userId,
progress: List<LessonProgress { lessonId, videoWatched, quizScore default=-1, notesDownloaded }>,
completedAt (nullable), createdAt
```

### 7. Discussion
```
@Document("discussions")
id, courseId (unique indexed),
messages: List<Message { userId, username, message, createdAt }>
```

### 8. PendingRequest
```
@Document("pending_requests")
id, instructorId (unique indexed), resumeUrl, idProofUrl,
status: enum[PENDING, APPROVED, REJECTED] default=PENDING,
createdAt
```

### 9. OTP
```
@Document("otps")
id, email (unique indexed), codeHash, expiresAt, attempts: int default=5,
createdAt (TTL index: expireAfterSeconds=900)
```

### 10. Payment
```
@Document("payments")
id, userId, courseId, price: double,
orderId (unique indexed), paymentId,
status: enum[CREATED, PAID, FAILED] default=CREATED,
createdAt, updatedAt
```

---

## 🛣️ REST API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register student |
| POST | `/api/auth/login` | Public | Login → JWT |
| POST | `/api/auth/send-otp` | Public (rate-limited) | Send OTP |
| POST | `/api/auth/verify-email` | Bearer | Verify OTP |
| POST | `/api/auth/forgot-password` | Public | Send reset OTP |
| POST | `/api/auth/reset-password` | Public | Reset password |
| POST | `/api/auth/instructor-apply` | Bearer | Submit application |
| POST | `/api/auth/google` | Public | Google token → JWT |
| GET | `/api/auth/me` | Bearer | Current user |

### Courses (`/api/courses`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses` | Bearer | All published courses |
| GET | `/api/courses/{id}` | Bearer | Course + lessons |
| POST | `/api/courses` | INSTRUCTOR | Create |
| PUT | `/api/courses/{id}` | INSTRUCTOR (owner) | Update |
| DELETE | `/api/courses/{id}` | INSTRUCTOR/ADMIN | Delete |
| GET | `/api/courses/my` | INSTRUCTOR | Own courses |

### Lessons (`/api/lessons`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/lessons` | INSTRUCTOR | Add lesson |
| GET | `/api/lessons/course/{courseId}` | Bearer (enrolled) | Get lessons |
| PUT | `/api/lessons/{id}` | INSTRUCTOR | Update |
| DELETE | `/api/lessons/{id}` | INSTRUCTOR | Delete |

### Quiz (`/api/quiz`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/quiz` | INSTRUCTOR | Create/update |
| GET | `/api/quiz/lesson/{lessonId}` | Bearer | Fetch quiz |
| POST | `/api/quiz/submit` | Bearer | Submit → score |

### Cart (`/api/cart`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | Bearer | Cart + course details |
| POST | `/api/cart/add` | Bearer | Add course |
| DELETE | `/api/cart/remove/{courseId}` | Bearer | Remove |

### Progress (`/api/progress`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/progress/{courseId}` | Bearer | Get progress |
| PATCH | `/api/progress/update` | Bearer | Update lesson |

### Discussions (`/api/discussions`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/discussions/{courseId}` | Bearer | Get messages |
| POST | `/api/discussions/{courseId}` | Bearer (enrolled) | Post message |

### Payments (`/api/payments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-order` | Bearer | Razorpay order |
| POST | `/api/payments/verify` | Bearer | Verify → enroll |

### Admin (`/api/admin`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/stats` | ADMIN | Platform stats |
| GET | `/api/admin/pending-requests` | ADMIN | Applications |
| POST | `/api/admin/verify-instructor` | ADMIN | Approve |
| POST | `/api/admin/reject-instructor` | ADMIN | Reject + email |

### Upload (`/api/upload`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/upload/presigned-url` | Bearer | S3 presigned URL |

---

## 🔐 Security Architecture

### JWT Flow
```
POST /api/auth/login → { token: "eyJ..." }   (7 day expiry)
All requests        → Authorization: Bearer <token>
JwtAuthFilter       → validate → inject into SecurityContext
```

### SecurityConfig Rules
```
/api/auth/**              → permitAll
/api/admin/**             → hasRole("ADMIN")
POST /api/courses         → hasRole("INSTRUCTOR")
POST /api/lessons         → hasRole("INSTRUCTOR")
POST /api/quiz            → hasRole("INSTRUCTOR")
all other                 → authenticated()
```

### Ownership Checks (Service layer)
```java
// Example in LessonService:
if (!course.getInstructorId().equals(currentUserId))
    throw new ForbiddenException("You do not own this course");
```

---

## ☁️ AWS S3 Upload Flow

```
1. React → POST /api/upload/presigned-url { fileName, contentType, folder }
2. Spring → generate presigned PUT URL (15 min validity) + final fileUrl
3. React → PUT presignedUrl with file binary (direct to S3, no server hop)
4. React saves fileUrl in form state → sends to course/lesson create endpoint
```

---

## 💳 Razorpay Payment Flow

```
1. Student clicks Pay → POST /api/payments/create-order { courseId }
2. Spring → calls Razorpay REST API → { orderId, amount, currency }
3. Frontend → opens Razorpay checkout widget
4. On success → POST /api/payments/verify { orderId, paymentId, signature, courseId }
5. Spring → HMAC-SHA256 verify → save Payment → enroll → remove from cart
```

---

## 📧 Email Service (Spring Mail)

```java
// JavaMailSender via Gmail SMTP
sendOtpEmail(to, otp)          // HTML: verification + reset
sendRejectionEmail(to)         // admin rejection notification
// OTP: BCrypt hashed, 5 attempts max, 10 min expiry
```

---

## 📱 Frontend Pages

### Auth Pages
| Route | Page | Components |
|-------|------|------------|
| `/login` | Login | `LoginForm`, `GoogleLoginButton` |
| `/register` | Register | `RegisterForm` |
| `/verify-email` | OTP Verify | `OtpInput`, `ResendButton` |
| `/forgot-password` | Forgot PW | `ForgotPasswordForm` (3-step) |
| `/instructor/register` | Instructor Apply | `S3FileUploader`, `ApplicationForm` |

### Student Pages
| Route | Page | Components |
|-------|------|------------|
| `/dashboard` | Student Home | `EnrolledCourseCard`, `CircularProgress` |
| `/browse` | Browse | `CourseCard`, `FilterPanel`, `SearchBar` |
| `/course/:id` | Course Detail | `CourseHero`, `LessonList`, `PaymentModal` |
| `/course/:id/learn` | Viewer | `ViewerSidebar`, `VideoPlayer`, `QuizSection`, `DiscussionSection` |

### Instructor Pages
| Route | Page | Components |
|-------|------|------------|
| `/instructor/dashboard` | Dashboard | `MyCourseCard`, `IncomeCard`, `AddCourseModal` |
| `/instructor/course/:id` | Course Mgmt | `CourseInfoForm`, `LessonRow`, `AddLessonModal` |
| `/instructor/quiz/:lessonId` | Quiz Mgmt | `McqEditor`, `TheoryEditor` |

### Admin Pages
| Route | Page | Components |
|-------|------|------------|
| `/admin/dashboard` | Admin Home | `StatCard`, `RequestsTable`, `DocumentPreviewModal` |

---

## 📊 Frontend State

### Zustand Stores
```typescript
// authStore: user, token (localStorage), login(), logout(), initialize()
// cartStore: items, fetchCart(), addToCart(), removeFromCart(), clearCart()
// courseViewerStore: currentLessonIndex, progress[], setCurrentLesson(), updateProgress()
```

### Axios Instance
```typescript
// Authorization: Bearer <token> on every request
// On 401 → auto logout
```

### TanStack Query Hooks
```
useCourses(filters)         → GET /api/courses
useCourseDetail(id)         → GET /api/courses/:id
useProgress(courseId)       → GET /api/progress/:courseId
useDiscussion(courseId)     → GET /api/discussions/:courseId
useInstructorCourses()      → GET /api/courses/my
```

---

## 🎨 Design System

### Tailwind Config
```js
colors: {
  brand:   { 50:'#f0fdf4', 500:'#22c55e', 600:'#16a34a', 900:'#14532d' },
  surface: { DEFAULT:'#0f172a', card:'#1e293b', border:'#334155' }
},
fontFamily: { sans: ['Inter', 'sans-serif'] }
```

### UI Components
`Button`, `Input`, `Modal` (Radix), `Badge`, `Progress` (linear + circular),
`Spinner`, `Avatar`, `Tabs` (Radix), `Card` (glassmorphism), `Skeleton`

---

## 🔑 Environment Variables

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Backend (`application.properties`)
```properties
server.port=8080
spring.data.mongodb.uri=mongodb+srv://...
spring.data.mongodb.database=learnflow
jwt.secret=your_256bit_secret
jwt.expiry=604800000
google.client.id=your_google_client_id
aws.s3.region=ap-south-1
aws.s3.bucket=learnflow-uploads
aws.access-key=...
aws.secret-key=...
razorpay.key.id=...
razorpay.key.secret=...
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 📋 Full Feature Checklist

### Phase 1 — Project Setup
- [ ] `npm create vite@latest frontend -- --template react-ts`
- [ ] Configure Tailwind CSS v3 in frontend
- [ ] Spring Boot via Spring Initializr (Web, Data MongoDB, Security, Mail, Validation, Lombok)
- [ ] `CorsConfig.java` — allow `http://localhost:5173`
- [ ] `MongoConfig.java` — `@EnableMongoAuditing`
- [ ] All env variables (`.env` + `application.properties`)
- [ ] Full folder structure both sides

### Phase 2 — Database Models
- [ ] All 10 `@Document` model classes with Lombok `@Data`/`@Builder`
- [ ] All enums: `Role`, `Level`, `RequestStatus`, `PaymentStatus`
- [ ] All 10 `MongoRepository` interfaces
- [ ] All Request DTOs (RegisterRequest, LoginRequest, CreateCourseRequest, etc.)
- [ ] All Response DTOs (AuthResponse, CourseResponse, etc.)

### Phase 3 — Auth System
- [ ] `SecurityConfig.java` (stateless, role-based)
- [ ] `JwtUtil.java` + `JwtAuthFilter.java` + `UserDetailsServiceImpl.java`
- [ ] `GlobalExceptionHandler.java` (@ControllerAdvice)
- [ ] `POST /api/auth/register` — BCrypt, Cart create, send OTP
- [ ] `POST /api/auth/login` → JWT
- [ ] `POST /api/auth/send-otp` (Bucket4j rate limit)
- [ ] `POST /api/auth/verify-email`
- [ ] `POST /api/auth/forgot-password`
- [ ] `POST /api/auth/reset-password`
- [ ] `POST /api/auth/google`
- [ ] `POST /api/auth/instructor-apply`
- [ ] `GET /api/auth/me`
- [ ] `EmailService.java` with HTML templates

### Phase 4 — AWS S3 Upload
- [ ] `AwsS3Config.java` — S3Client + S3Presigner beans
- [ ] `S3Service.java` — presigned PUT URL generation
- [ ] `POST /api/upload/presigned-url`
- [ ] `S3FileUploader` React component (drag & drop + progress bar)

### Phase 5 — Course Management (Instructor)
- [ ] `POST /api/courses` + Discussion auto-create
- [ ] `GET /api/courses/my`
- [ ] `POST /api/lessons` (ownership check)
- [ ] `PUT /api/lessons/{id}`
- [ ] `POST /api/quiz` (upsert)
- [ ] `GET /api/quiz/lesson/{lessonId}`
- [ ] Instructor Dashboard page
- [ ] Course Management page
- [ ] Quiz Management page

### Phase 6 — Student Features
- [ ] `GET /api/courses` (paginated, search + filter)
- [ ] `GET /api/courses/{id}` (enrollment gate)
- [ ] Browse page
- [ ] Course Detail page
- [ ] Student Dashboard page
- [ ] `GET /api/progress/{courseId}`
- [ ] `PATCH /api/progress/update`
- [ ] Course Viewer page
- [ ] `POST /api/quiz/submit` (auto-grade)
- [ ] Discussion endpoints + UI

### Phase 7 — Payments
- [ ] Razorpay `create-order` via RestTemplate
- [ ] `verify` endpoint with HMAC check → enroll → cart cleanup
- [ ] Cart CRUD endpoints
- [ ] Frontend payment modal + cart page

### Phase 8 — Admin
- [ ] `GET /api/admin/stats`
- [ ] `GET /api/admin/pending-requests`
- [ ] `POST /api/admin/verify-instructor`
- [ ] `POST /api/admin/reject-instructor` + email
- [ ] Admin Dashboard page

### Phase 9 — Polish & UX
- [ ] Skeleton loaders everywhere
- [ ] React error boundaries
- [ ] `react-hot-toast` notifications
- [ ] Framer Motion transitions
- [ ] Mobile responsive layouts
- [ ] Dark mode

---

## 🔄 Key Improvements Over Original

| Area | Original (EduCore) | LearnFlow (Spring Boot) |
|------|---------------------|--------------------------|
| Backend lang | JavaScript | **Java 21** (type-safe) |
| Auth | Manual JWT + cookies | **Spring Security + JWT Bearer** |
| API style | All POST routes | **RESTful** (proper HTTP verbs) |
| Validation | Manual if-checks | **@Valid + Bean Validation** |
| Error handling | Scattered try/catch | **@ControllerAdvice** |
| Quiz schema | Flat parallel arrays | **Embedded typed objects** |
| Progress schema | `[[Number]]` matrix | **LessonProgress objects** |
| Forms | Manual state | **React Hook Form + Zod** |
| Data fetching | Axios + useEffect | **TanStack Query** |
| Uploads | Multer via server | **S3 presigned URLs** |
| Rate limiting | express-rate-limit | **Bucket4j** |
| Role naming | `"user"` | **`"student"`** |

---

## 🚦 Development Order

```
Week 1: Setup + Auth + Models
  Day 1-2: Spring Boot + React + Vite + Tailwind init, CORS
  Day 3-4: All 10 models + Repositories + DTOs
  Day 5-7: Spring Security + JWT + all auth endpoints + OTP email

Week 2: Core Features
  Day 8-9:  AWS S3 presigned URLs + React FileUploader
  Day 10-11: Course + Lesson CRUD
  Day 12-14: Quiz system (create, fetch, submit, grade)

Week 3: Student & Payments
  Day 15-16: Browse + Course Detail + enrollment
  Day 17-18: Course Viewer (video + progress)
  Day 19:    Cart system
  Day 20-21: Razorpay integration

Week 4: Admin + Polish
  Day 22:    Admin dashboard + instructor approval
  Day 23-24: Discussion system
  Day 25-26: UI polish (skeletons, animations)
  Day 27-28: Testing + deployment
```

---

## 🗒️ Notes

> [!IMPORTANT]
> Token storage: JWT in **`localStorage`**, sent as `Authorization: Bearer <token>`. Spring is fully stateless — no cookies, no sessions.

> [!TIP]
> Use **Bucket4j** for rate limiting `/api/auth/send-otp`. Runs as a Spring component — no extra infra needed.

> [!WARNING]
> Razorpay has no official Maven SDK. Call their REST API via `RestTemplate` with Basic Auth (`Base64(key_id:key_secret)` in `Authorization` header).

> [!NOTE]
> The original `UserProgress` uses a confusing `[[Number]]` matrix. LearnFlow uses a clean `List<LessonProgress>` with named fields: `videoWatched`, `quizScore`, `notesDownloaded`.

> [!CAUTION]
> Always verify Razorpay HMAC-SHA256 signature **server-side** before enrolling. Never trust the client on payment success.
