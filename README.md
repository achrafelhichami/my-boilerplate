# Next.js Boilerplate

A modern, production-ready Next.js boilerplate with authentication, file storage, and a beautiful dark UI design system.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Features

- ⚡ **Next.js 16** with App Router and React 19
- 🔐 **Authentication** with Better Auth (Magic Link + Google OAuth)
- 🗄️ **Database** with Prisma ORM (PostgreSQL)
- 📧 **Email** with Resend
- 📁 **File Storage** with Cloudflare R2 (S3-compatible)
- 🎨 **UI Components** with shadcn/ui
- 🌙 **Dark Theme** design system
- 📝 **Form Validation** with Zod + React Hook Form
- 🔔 **Toast Notifications** with Sonner

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd my-boilerplate
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Resend (Email)
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"

# Cloudflare R2 (File Storage)
CLOUDFLARE_ACCOUNT_ID="your-account-id"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key"
CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
CLOUDFLARE_R2_PUBLIC_URL="https://your-public-domain.com"  # Optional

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/
│   ├── (auth)/              # Auth route group
│   │   └── login/           # Login page
│   ├── api/
│   │   └── auth/[...all]/   # Better Auth API routes
│   ├── globals.css          # Design system & styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── auth/                # Auth components
│   │   └── auth-form.tsx    # Login/signup form
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── actions/             # Server actions
│   │   ├── auth.ts          # Auth actions
│   │   └── storage.ts       # File storage actions
│   ├── auth/                # Auth configuration
│   │   ├── auth.ts          # Better Auth server config
│   │   └── auth-client.ts   # Better Auth client
│   ├── email/               # Email utilities
│   │   ├── email-templates.ts
│   │   └── resend.ts
│   ├── storage/             # File storage utilities
│   │   ├── client.ts        # R2 client
│   │   ├── hooks.ts         # Upload hooks
│   │   └── index.ts         # Storage functions
│   ├── validations/         # Zod schemas
│   ├── db.ts                # Prisma client
│   ├── toast.ts             # Toast utilities
│   └── utils.ts             # General utilities
├── prisma/
│   └── schema.prisma        # Database schema
└── prisma.config.ts         # Prisma configuration
```

### Colors

| Token                | Color     | Usage               |
| -------------------- | --------- | ------------------- |
| `--primary`          | `#c8ff00` | CTAs, active states |
| `--accent`           | `#a855f7` | Highlights          |
| `--background`       | `#0d0d14` | Page background     |
| `--card`             | `#16161f` | Card surfaces       |
| `--muted-foreground` | `#9ca3af` | Secondary text      |

### Utility Classes

```tsx
// Glow effects
<div className="glow-primary">Lime glow</div>
<div className="glow-accent">Purple glow</div>

// Glass effect
<div className="glass">Glassmorphism</div>

// Animated gradient border
<div className="border-gradient">Gradient border</div>

// Tab underline animation
<button className="tab-underline">Tab</button>

// Card hover effect
<div className="card-hover">Hover me</div>
```

## 🔔 Toast Notifications

```tsx
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showPromise,
} from "@/lib/toast";

// Simple messages
showSuccess("Success!", "Operation completed.");
showError("Error", "Something went wrong.");
showInfo("Info", "Here's some information.");
showWarning("Warning", "Be careful!");

// Async operations
showPromise(fetchData(), {
  loading: "Loading...",
  success: "Data loaded!",
  error: "Failed to load data",
});
```

## 📝 Form Validation

```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

## 📦 Tech Stack

| Category        | Technology            |
| --------------- | --------------------- |
| Framework       | Next.js 16            |
| Language        | TypeScript 5          |
| Styling         | Tailwind CSS 4        |
| UI Components   | shadcn/ui             |
| Authentication  | Better Auth           |
| Database        | Prisma + PostgreSQL   |
| Email           | Resend                |
| File Storage    | Cloudflare R2         |
| Form Validation | Zod + React Hook Form |
| Icons           | Lucide React          |

## 📄 License

MIT License - feel free to use this boilerplate for your projects!
