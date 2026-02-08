# Agile Scrum Dashboard - Reconstruction Guide

This guide describes the architecture, design, and implementation logic for the `agileScumBoard`. It is designed for an AI or developer to recreate the project from scratch without access to the original codebase.

## 1. Project Identity & Tech Stack

**Project Name:** Agile Scrum Dashboard
**Description:** A multi-tenant SaaS application for Agile training, featuring Kanban boards, daily check-ins, and admin analytics.

**Core Technologies:**

* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + `tailwindcss-animate`
* **State Management:** Zustand
* **Backend/Database:** Supabase (PostgreSQL)
* **UI Primitives:** Radix UI (Dialog, Dropdown, Select, Label)
* **Icons:** Lucide React
* **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
* **Utilities:** `clsx`, `tailwind-merge`

---

## 2. Design System

### **Color Palette (Tailwind / CSS Variables)**

The project uses a semantic color system based on HSL variables.

**Global CSS (`globals.css`):**

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --primary: 221.2 83.2% 53.3%; /* Blue */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%; /* Red */
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
.dark {
  /* Dark mode variants for the above */
}
```

**Task & Status Colors:**

* **Backlog:** Gray (`bg-gray-100`, `border-gray-300`)
* **To Do:** Blue (`bg-blue-50`, `border-blue-300`)
* **In Progress:** Amber (`bg-amber-50`, `border-amber-300`)
* **Blocked:** Red (`bg-red-50`, `border-red-300`)
* **Done:** Green (`bg-green-50`, `border-green-300`)

### **Typography**

* **Font:** Inter (via `next/font/google`).

---

## 3. Data Models (`src/lib/types/index.ts`)

These TypeScript interfaces define the core data structures used throughout the app.

```typescript
export type TenantId = 'walmart' | '3c-consulting' | 'primary-battery-tech' | 'wac-amp' | 'cob' | 'echelon' | 'arvest' | 'startup-lab' | 'admin';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'blocked' | 'done';

export interface Tenant {
  id: TenantId;
  name: string;
  displayName: string;
  isAdmin?: boolean;
}

export interface UserSession {
  username: string;
  userId: string;
  tenantId: TenantId;
  displayName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  storyPoints: number;
  assignee: string;
  blockerDetails?: string; 
  createdAt: string;
  tenantId: TenantId;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  sprintWeek: string;
  username: string; // Display Name
  whatIDidYesterday: string;
  whatIAmDoingToday: string;
  impediments: string;
  helpNeeded: string;
  tenantId: TenantId;
}
```

---

## 4. State Management & Backend Logic

The application uses **Zustand** stores that connect to **Supabase**.

**1. `authStore`:**

* Manages `session` state.
* Handles login logic: checks if user exists in Supabase.
* **New User Flow:** If user doesn't exist, prompt for `TenantId` selection, then create user record in Supabase.

**2. `taskStore`:**

* **`loadTasks(tenantId)`**: Fetches from `tasks` table where `tenant_id` matches.
* **`addTask/updateTask`**: Writes to Supabase, then updates local Zustand state.
* **Data Mapping:** Converts DB snake_case (`story_points`, `assignee_name`) to frontend camelCase (`storyPoints`, `assignee`).

**3. `checkInStore`:**

* **`loadCheckIns(tenantId)`**: Fetches daily check-ins.
* **`hasCheckInToday(userId)`**: Utility to check if the current user has already submitted for the current date.

---

## 5. Page Specifications

### **A. Login Page (`/login`)**

* **Layout:** Centered Card on a gradient background (`bg-gradient-to-br from-blue-50 to-indigo-100`).
* **Initial View:** Username & Password fields.
* **Logic:**
  * If user is found -> Log in & redirect to `/dashboard`.
  * If new user -> Slide down a **Native Select** (or Radix Select) to choose a Tenant Group (from `TENANTS` constant).
  * Show "First-time setup" warning.

### **B. Application Shell (Layout)**

* **Header:**
  * Sticky top bar.
  * Left: Logo + App Name + **Current Tenant Name** (with optional "ADMIN" badge).
  * Right: User Avatar (Initials) -> Dropdown Menu (Includes Logout).
* **Sidebar:**
  * Vertical navigation links.
  * **Active Link:** `bg-primary text-primary-foreground`.
  * **Inactive Link:** `text-gray-700 hover:bg-gray-100`.
  * **Links:** Kanban Board, Daily Check-In, Admin Analytics (only valid if `isAdmin`).

### **C. Kanban Board (`/dashboard`)**

* **Components:**
  * **Columns:** 5 horizontal columns (Backlog -> Done). Each has a colored header (see Colors section).
  * **Task Card:**
    * Shows: Priority Badge (colored pill), Title (truncated), Blocker Alert (if status=blocked).
    * **Interaction:** Draggable using `@dnd-kit`. Clicking opens Edit Modal.
  * **Task Modal (Dialog):**
    * Fields: Title, Description, Priority (Select), Status, Story Points (Select), Assignee.
    * **Conditional Field:** If Status is "Blocked", show a Textarea for "Blocker Details".
* **Logic:** Dragging a card to a new column instantly updates `status` in Store/DB.

### **D. Daily Check-In (`/check-in`)**

* **Top Section (Status Card):**
  * **If submitted today:** Green Card ("Great job, you've checked in").
  * **If not submitted:** Blue Info Card with "Submit Check-In" button.
* **Form (Modal/Card):**
  * Fields: Sprint Week, Yesterday's Work, Today's Plan, Impediments, Help Needed.
  * Read-only fields: Date (Today), Student Name.
* **History View:**
  * Two-column grid: "My Check-Ins" (Personal history) vs "Team Check-Ins" (Recent activity).

### **E. Admin Analytics (`/admin`)**

* **Access Control:** Redirects non-admin users to `/dashboard`.
* **KPI Cards:** Grid showing Total Tasks, Total Story Points, Active Students, Total Check-Ins. Uses colored icon backgrounds.
* **Filtering:** Global "Tenant Filter" dropdown to view stats for a specific group (e.g., Walmart) vs "All".
* **Tables:**
  * **Tenant Overview:** Aggregated stats per tenant.
  * **User Stats:** Leaderboard of user participation (check-in counts).

---

## 6. Implementation Data Structures

### **Supabase Schema (Implied)**

**Table: `tasks`**

* `id` (uuid)
* `title` (text)
* `description` (text)
* `priority` (text)
* `status` (text)
* `story_points` (int)
* `assignee_name` (text)
* `blocker_details` (text, nullable)
* `tenant_id` (text)
* `created_at` (timestamp)

**Table: `daily_checkins`**

* `id` (uuid)
* `user_id` (uuid)
* `date` (iso date string)
* `sprint_week` (text)
* `yesterday` (text)
* `today` (text)
* `impediments` (text)
* `help_needed` (text)
* `display_name` (text)
* `tenant_id` (text)
* `created_at` (timestamp)
