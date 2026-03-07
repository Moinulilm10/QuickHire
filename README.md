# QuickHire Project Documentation

QuickHire is a comprehensive job portal platform designed to connect employers with potential candidates. It features a robust job searching and application system for users, a detailed dashboard for administrators to manage jobs, companies, and applicants, and a powerful backend to handle data and authentication.

## 🖼️ Quick Guide (Images)

> [!NOTE]
> Below are the visual guides for the QuickHire platform.

### User Interface

| Page                   | Preview                                          |
| :--------------------- | :----------------------------------------------- |
| **Home Page**          | ![Home Page](./image/Home-page.png)              |
| **Jobs Listing**       | ![Jobs Page](./image/jobs-page.png)              |
| **Job Details**        | ![Job Details](./image/job-details-page.png)     |
| **Category-wise Jobs** | ![Category Page](./image/Category-wise-page.png) |
| **Featured Jobs**      | ![Featured Jobs](./image/Feature-job-page.png)   |
| **Latest Jobs**        | ![Latest Jobs](./image/latest-job-page.png)      |
| **Companies**          | ![Companies](./image/companies-page.png)         |

### User Workflow

| Step                     | Preview                                          |
| :----------------------- | :----------------------------------------------- |
| **Sign Up**              | ![Signup](./image/signup-page.png)               |
| **Login**                | ![Login](./image/login.png)                      |
| **Profile Management**   | ![Profile](./image/profile-page.png)             |
| **Job Application**      | ![Application](./image/job-application-page.png) |
| **Applied Jobs Section** | ![Applied Jobs](./image/applied-job-section.png) |

## �️ Admin Interface (Back-office)

> [!NOTE]
> Comprehensive management dashboard for system administrators.

### Dashboard & Auth

| Page                | Preview                                                    |
| :------------------ | :--------------------------------------------------------- |
| **Admin Login**     | ![Admin Login](./image/admin/admin-login-page.png)         |
| **Admin Dashboard** | ![Admin Dashboard](./image/admin/admin-dashboard-page.png) |

### Management Sections

| Section                    | Preview                                                             |
| :------------------------- | :------------------------------------------------------------------ |
| **Jobs Management**        | ![Jobs Management](./image/admin/admin-jobs-page.png)               |
| **Company Management**     | ![Company Management](./image/admin/admin-company-section.png)      |
| **Category Management**    | ![Category Management](./image/admin/admin-categories-section.png)  |
| **Job Applicant Tracking** | ![Applicant Tracking](./image/admin/admin-jobapplicant-section.png) |
| **User Management**        | ![User Management](./image/admin/admin-user-section.png)            |

### Action Workflows

| Action               | Preview                                                           |
| :------------------- | :---------------------------------------------------------------- |
| **Create Job**       | ![Create Job](./image/admin/admin-job-create-modal.png)           |
| **Job Details View** | ![Job Details](./image/admin/admin-job-details-page.png)          |
| **Update Job**       | ![Update Job](./image/admin/admin-job-update-page.png)            |
| **Create Company**   | ![Create Company](./image/admin/admin-company-create-modal.png)   |
| **Update Company**   | ![Update Company](./image/admin/admin-company-update-modal.png)   |
| **Create Category**  | ![Create Category](./image/admin/admin-category-create-modal.png) |
| **Update Category**  | ![Update Category](./image/admin/admin-category-update-modal.png) |

## �🚀 Tech Stack & Tools

### Client (Frontend)

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Authentication**: NextAuth.js (Google OAuth support)
- **Data Fetching**: Custom services with `fetch` API
- **State Management**: React `useReducer`, Context API
- **Verification**: Jest, React Testing Library

### Admin (Dashboard)

- **Framework**: Next.js 15
- **Language**: TypeScript
- **State Management**: React 19 `useReducer`, `useTransition`, `use` hook
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Verification**: Jest

### Server (Backend)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT, bcryptjs, google-auth-library
- **File Uploads**: Multer
- **Verification**: Jest, Supertest

---

## 🛠️ How to Run Locally

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running
- npm or yarn

### 1. Server Setup

```bash
cd server
npm install
# Configure .env (see Environment Variables section)
npx prisma db push
npx prisma db seed
npm run dev
```

### 2. Client Setup

```bash
cd client
npm install
# Configure .env
npm run dev
```

### 3. Admin Setup

```bash
cd admin
npm install
# Configure .env
npm run dev
```

---

## ✨ Features

### 👤 Client (User-facing)

- **Job Search & Filtering**: Explore jobs by category, location, and type.
- **Dynamic Categories**: Featured categories on the homepage based on job count.
- **User Authentication**: Secure Sign Up/Sign In and Google OAuth integration.
- **Profile Management**: Update personal info, profile picture, and track applications.
- **Job Application**: Apply for jobs with cover letters and resume uploads.
- **Responsive Design**: Fully optimized for mobile and desktop.

### 🛠️ Admin (Management)

- **Dashboard Stats**: Real-time overview of jobs, companies, and applications.
- **Job Management**: Create, edit, and delete job listings.
- **Company Management**: Manage partner company profiles.
- **Applicant Tracking**: Review applications and update status (Pending/Accepted/Rejected).
- **Modern UI**: Built with React 19 features for smooth data fetching and transitions.

### ⚙️ Server (Logic & API)

- **RESTful API**: Structured routes for all resources.
- **Role-Based Access**: Middleware to protect admin and user-specific actions.
- **Media Handling**: Secure file storage for resumes and profile pictures.
- **Database Migrations**: Managed via Prisma for consistency.

---

## 🔌 API Documentation

### Auth

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/profile` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile & picture (Protected)

### Jobs

- `GET /api/jobs` - Get all jobs (supports pagination/filters)
- `GET /api/jobs/latest` - Get most recent jobs
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/:id` - Get specific job details
- `POST /api/jobs` - Create a new job (Admin)
- `PUT /api/jobs/:id` - Update a job (Admin)
- `DELETE /api/jobs/:id` - Delete a job (Admin)

### Applications

- `POST /api/applications` - Submit a job application (User)
- `GET /api/applications/my` - Get user's applications (User)
- `GET /api/applications` - Get all applications (Admin)
- `PATCH /api/applications/:id/status` - Update application status (Admin)

### Categories & Companies

- `GET /api/categories` - List all job categories
- `GET /api/companies` - List all registered companies

---

## 🧪 Testing & Verification

The project uses **Jest** across all modules.

### Running Tests

- **Server**: `cd server && npm test` (Integration tests for companies)
- **Client**: `cd client && npm test` (Service layer unit tests)
- **Admin**: `cd admin && npm test`

### Key Test Cases

- **Auth Service**: Validates token handling and login logic.
- **Application Flow**: Ensures resumes are correctly uploaded and mapped to users.
- **Job Filtering**: Verifies category-based job filtering logic.

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable           | Description                      |
| :----------------- | :------------------------------- |
| `PORT`             | Local server port (default 5500) |
| `DATABASE_URL`     | PostgreSQL connection string     |
| `JWT_SECRET`       | Secret key for token signing     |
| `GOOGLE_CLIENT_ID` | OAuth Client ID                  |
| `CLIENT_URL`       | URL of the client application    |

### Client/Admin (`.env`)

| Variable               | Description                 |
| :--------------------- | :-------------------------- |
| `NEXT_PUBLIC_API_URL`  | URL of the backend API      |
| `NEXTAUTH_SECRET`      | Secret for NextAuth session |
| `GOOGLE_CLIENT_ID`     | OAuth Client ID             |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret         |

---

## 🌐 Live URLs & Accounts

### Client

- **URL**: [https://quick-hire-sable-mu.vercel.app/](https://quick-hire-sable-mu.vercel.app/)
- **Test User**: `testuser@quickhire.com` / `testquickhire12345`

### Admin

- **URL**: [https://quick-hire-rh1o.vercel.app/login](https://quick-hire-rh1o.vercel.app/login)
- **Account**: `admin@quickhire.com` / `adminquickhire123`
