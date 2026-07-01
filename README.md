<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0050?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-2-8884D8?style=for-the-badge" />
</p>

# 🏛️ Neuravixor — Educational Institution Management System

A **premium, full-featured frontend** for managing educational institutions — students, teachers, attendance, exams, fees, and academic analytics — built with a stunning **Cosmic Glassmorphism** dark UI.

> 🎯 **Purpose:** Client-ready interactive prototype. No backend required — all data is reactive and session-scoped.

---

## ✨ Preview

| Landing Page | Dashboard Overview |
|---|---|
| Premium hero section with floating dashboard preview | Live KPI cards, attendance donut chart, & sparkline graphs |

| Student Directory | Teacher Profiles |
|---|---|
| Searchable datatable with filters, CRUD modals | Profile cards grid with detailed bio & schedule popups |

| Attendance Tracker | Exam & Gradebook |
|---|---|
| Interactive Present/Absent/Leave toggles per student | Schedule exams, enter scores, view grade sheets |

---

## 🚀 Key Features

### Core Modules
- **📊 Interactive Dashboard** — Real-time KPI cards (students, teachers, classes, attendance) with animated Recharts graphs
- **👨‍🎓 Student Management** — Enroll, edit, delete students with searchable/filterable datatable & attendance progress bars
- **👩‍🏫 Teacher Profiles** — Faculty card grid with detailed profile modals (bio, schedule, department)
- **📚 Classes & Rooms** — Course management with teacher assignment, scheduling, and capacity tracking
- **📅 Attendance Tracker** — Daily attendance grid with instant Present/Absent/Leave toggles that update dashboard analytics live
- **📝 Exams & Gradebook** — Schedule exams, enter student scores, view graded results per exam
- **💰 Fee Management** — Issue invoices, record payments (Credit Card/Bank/PayPal/Cash), track overdue accounts
- **📈 Academic Reports** — Subject competency bar charts, GPA donut charts, attendance-vs-grade correlation lines
- **⚙️ System Settings** — Theme selector, display preferences, system stats, and demo data reset

### Advanced Features
- **🔍 Global Command Palette** — Press `Ctrl+K` to instantly search students, teachers, classes, and navigate pages
- **🔔 Live Notifications** — Real-time bell dropdown with color-coded alerts (success/warning/info) triggered by every action
- **✨ Cosmic Glassmorphism UI** — Translucent panels, neon glow borders, radial mesh gradients, and micro-animations
- **🎬 Framer Motion Animations** — Smooth page transitions, floating cards, layout animations, and spring physics
- **📱 Fully Responsive** — Works on desktop, tablet, and mobile screens
- **🎨 Theme System** — Cosmic Neon (default), Emerald Night, and Amber Horizon theme options

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with file-based routing |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling with custom design tokens |
| **Framer Motion** | Premium animations and layout transitions |
| **Recharts** | Interactive charts (bar, pie, area, line) |
| **Lucide React** | Beautiful consistent icon system |
| **React Context API** | Client-side state management with CRUD operations |

---

## 📦 Getting Started

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/neuravixor.git
cd neuravixor

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.  
Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the management system.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with SEO metadata
│   ├── page.tsx                # Premium landing page
│   ├── globals.css             # Tailwind v4 theme & glassmorphism styles
│   └── dashboard/
│       └── page.tsx            # Dashboard entry point
├── components/
│   ├── DashboardShell.tsx      # Main shell (sidebar + header + content)
│   ├── Sidebar.tsx             # Animated vertical navigation
│   ├── CommandPalette.tsx      # Ctrl+K global search overlay
│   ├── NotificationsPanel.tsx  # Bell dropdown notification feed
│   ├── DashboardOverview.tsx   # KPI cards, charts, student/teacher lists
│   ├── StudentsView.tsx        # Student directory with CRUD
│   ├── TeachersView.tsx        # Faculty profiles grid with CRUD
│   ├── ClassesView.tsx         # Class management with capacity tracking
│   ├── AttendanceView.tsx      # Daily attendance grid tracker
│   ├── ExamsView.tsx           # Exam scheduler & gradebook
│   ├── FeesView.tsx            # Invoice & payment management
│   ├── ReportsView.tsx         # Academic analytics charts
│   └── SettingsView.tsx        # Preferences & system info
└── context/
    └── DataContext.tsx          # Global state provider with mock data
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--background` | `#05070C` | Page background |
| `--brand-blue` | `#3B82F6` | Primary actions, links |
| `--brand-purple` | `#8B5CF6` | Accents, gradients |
| `--brand-cyan` | `#06B6D4` | Highlights, badges |
| `glass-panel` | `rgba(10,15,30,0.7)` + `blur(16px)` | Card backgrounds |
| `glass-panel-glow` | Purple border glow + inset shadow | Hover/active cards |

---

## 🧩 How It Works

This is a **frontend-only** application — there is no backend, database, or API.

- All data (students, teachers, classes, exams, fees, attendance) lives in **React Context** state
- The app ships with **pre-populated mock data** (8 students, 4 teachers, 4 classes, 4 exams, 8 invoices)
- Every CRUD action (add/edit/delete) immediately updates all related views and dashboard metrics
- Data resets on page reload (session-scoped)

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <b>Built with ❤️ by Neuravixor Systems</b><br/>
  <sub>© 2026 All Rights Reserved</sub>
</p>
