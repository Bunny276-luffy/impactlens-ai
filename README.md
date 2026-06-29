# ImpactLens AI - NGO Intelligence Platform

ImpactLens AI is a production-ready, AI-powered intelligence platform designed for NGOs, donors, and volunteers. It measures, predicts, and improves the educational and nutritional growth of underprivileged children.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**, the platform connects directly with an Amazon Aurora PostgreSQL database. It is engineered with strict hydration guards to ensure a fast, warnings-free user experience both locally and in production.

---

## 🌟 Key Features

* **Authentication**: Multi-role portal mapping (Admin, NGO, Donor, Volunteer) powered by NextAuth.js.
* **Dashboard Summary**: Real-time aggregated stats, priority alert metrics, and interactive longitudinal charts mapping child enrollment and donation growth.
* **Child Management**: Comprehensive enrollment database with full status timeline logs.
* **AI Insights Panel**: Predictive analysis identifying high dropout vulnerabilities, severe malnutrition index markers, and custom talents (e.g., Mathematics, Drawing) with recommendations.
* **Donor Portal**: Child sponsorship module, direct donation history logs, and gamified achievement badge rewards.
* **Volunteer Portal**: Chore task-list scheduling and health/education audit update modules.
* **Analytical Reports**: Customizable PDF/Print configuration scopes.
* **Notifications Hub**: In-app notifications with real-time polling updates.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons, Recharts
* **Backend**: Next.js Server Components, API routes (NextResponse)
* **Database**: Amazon Aurora PostgreSQL (or any PostgreSQL instance)
* **ORM**: Prisma Client v7.8.0
* **Authentication**: NextAuth.js (Credentials Provider)
* **Encryption**: Bcrypt.js

---

## 📂 Folder Structure

```
├── prisma/
│   ├── schema.prisma   # Prisma schema definitions (PostgreSQL connection)
│   └── seed.js         # Seeding script for demo databases
├── src/
│   ├── app/
│   │   ├── api/        # REST endpoints (auth, analytics, child, donations, notifications, volunteer)
│   │   ├── dashboard/  # Protected Main Dashboard routes
│   │   ├── login/      # Sign-in views
│   │   ├── error.tsx   # Global Next.js error boundary
│   │   ├── layout.tsx  # Root html layout wrapper
│   │   ├── loading.tsx # Root loading fallback spinner
│   │   └── page.tsx    # Premium landing page
│   ├── components/     # UI Component registry
│   │   ├── dashboard/  # Panels (Overview, ChildManagement, AIPredictions, DonorPortal, VolunteerPortal, Reports)
│   │   ├── Header.tsx  # Shared Header
│   │   └── Footer.tsx  # Shared Footer
│   ├── contexts/       # React Context providers (Toast, etc.)
│   ├── lib/            # Shared utilities (Prisma client initializer, repository queries)
└── .env.example        # Environment variables configuration template
```

---

## ⚙️ Environment Variables

Configure the following variables in a `.env` file at the root:

```env
# Database connection string
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<AURORA_ENDPOINT>:<PORT>/<DB_NAME>?sslmode=require"

# NextAuth secret key (for JWT encryption)
NEXTAUTH_SECRET="your_nextauth_secret_key_here"

# Public site domain URL
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🚀 Getting Started Locally

### Prerequisite
Ensure a local or cloud-based PostgreSQL instance is running.

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Configure Database & Migrations
Sync the schema to your database instance and seed the mock database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Access Credentials

The database seeding scripts create the following default demo profiles:

* **Admin Portal**:
  * Email: `admin@impactlens.ai`
  * Password: `Admin@123`
* **NGO Portal**:
  * Email: `ngo@impactlens.ai`
  * Password: `Ngo@123`
* **Donor Portal**:
  * Email: `donor@impactlens.ai`
  * Password: `Donor@123`
* **Volunteer Portal**:
  * Email: `volunteer@impactlens.ai`
  * Password: `Volunteer@123`

---

## 🌍 Vercel Deployment Instructions

1. **Push your repository** to a public or private GitHub repository.
2. Log into the [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. **Import** the repository `impactlens-ai`.
4. In the configuration step, expand **Environment Variables** and add:
   * `DATABASE_URL`
   * `NEXTAUTH_SECRET`
   * `NEXTAUTH_URL`
5. Click **Deploy**. Vercel will automatically generate the production bundle, sync configurations, and host your app live.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
