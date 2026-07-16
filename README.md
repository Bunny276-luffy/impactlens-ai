# ImpactLens AI - Split Project Architecture

This repository has been restructured into two independent applications: a **Frontend** client and a **Backend** server.

## 📂 Project Structure

```
ImpactLens-AI/
├── frontend/
│   ├── app/                # Frontend pages and routing (excluding API routes)
│   ├── components/         # Premium UI Components (Panels, Header, Footer)
│   ├── contexts/           # Toast and global React contexts
│   ├── lib/                # Client-side API client (apiFetch)
│   ├── public/             # SVG assets and static public files
│   ├── utils/              # Client-side helper functions (formatDate, formatTime)
│   ├── package.json        # Frontend configuration and dependencies
│   ├── next.config.js      # Frontend Next.js configuration
│   └── tsconfig.json       # Frontend typescript compiler options
│
├── backend/
│   ├── app/
│   │   └── api/            # API Route handlers (Auth, Analytics, Children, NGO, etc.)
│   ├── prisma/             # Database schemas, migrations, and seed scripts
│   ├── services/           # Service layer business logic
│   ├── lib/                # Database configurations, mock JSON DB, and response structures
│   ├── middleware.ts       # Backend middleware matching API endpoints
│   ├── package.json        # Backend configuration and dependencies
│   ├── next.config.js      # Backend Next.js configuration
│   └── tsconfig.json       # Backend typescript compiler options
│
└── README.md               # Main project overview and split architecture
```

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Framework**: Next.js 15 (App Router), React 19
- **Port**: `3000`
- **Dependencies**: `lucide-react`, `next-auth`, `recharts`, `tailwindcss`, `postcss`
- **Port Communication**: Communicates to the Backend REST API using `NEXT_PUBLIC_API_URL`.

### Backend
- **Framework**: Next.js 15 (App Router), React 19
- **Port**: `4000`
- **ORM & DB**: Prisma Client with PostgreSQL (optional fallback to a JSON mock database file)
- **Dependencies**: `@prisma/client`, `bcryptjs`, `next-auth`

---

## 🚀 Running Locally

### 1. Set Up Environment Variables

Configure **frontend/.env**:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_SECRET=impactlens_secret_9988776655
NEXTAUTH_URL=http://localhost:3000
```

Configure **backend/.env**:
```env
NEXTAUTH_SECRET=impactlens_secret_9988776655
NEXTAUTH_URL=http://localhost:4000
DATABASE_URL=
PRISMA_CLIENT_ENGINE_TYPE=library
```

### 2. Install & Start Backend

Navigate to `backend/`, install dependencies, run migrations/seed, and start development:
```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed # Seeds mock database or SQL database
npm run dev
```

The Backend server will start on [http://localhost:4000](http://localhost:4000).

### 3. Install & Start Frontend

Navigate to `frontend/`, install dependencies, and start development:
```bash
npm install
npm run dev
```

The Frontend client will start on [http://localhost:3000](http://localhost:3000).

---

## 🔑 Demo Access Credentials

The database seeding scripts create the following default demo profiles:

* **NGO Portal**:
  * Email: `ngo@impactlens.ai`
  * Password: `password123`
* **Donor Portal**:
  * Email: `donor@impactlens.ai`
  * Password: `password123`
* **Volunteer Portal**:
  * Email: `volunteer@impactlens.ai`
  * Password: `password123`
* **Admin Portal**:
  * Email: `admin@impactlens.ai`
  * Password: `password123`
