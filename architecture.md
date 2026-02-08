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

The project uses a semantic color system based on HSL variables with explicit utility classes for visibility.

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

**Primary UI Colors (Explicit Utilities):**

* **Backgrounds:** `bg-white`, `bg-gray-50`, `bg-gray-100`
* **Text Colors:** `text-gray-900` (headings), `text-gray-700` (body), `text-gray-600` (subtitles), `text-gray-500` (metadata)
* **Borders:** `border-gray-200`, `border-gray-300`
* **Primary Accent:** `bg-blue-600`, `hover:bg-blue-700`, `text-blue-600`

**Task & Status Colors:**

* **Backlog:** Gray (`border-gray-300` for column header)
* **To Do:** Blue (`border-blue-300` for column header)
* **In Progress:** Amber/Yellow (`border-amber-300` for column header)
* **Blocked:** Red (`border-red-300` for column header)
* **Done:** Green (`border-green-300` for column header)
* **Column Content Area:** `bg-gray-50` for all columns

### **Typography**

* **Font:** Inter (via `next/font/google`)
* **Text Scale:** Headings use `text-2xl font-bold text-gray-900`, subtitles use `text-sm text-gray-600`

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

* **Layout Structure:**
  * Full-height flex layout (`h-screen overflow-hidden bg-gray-50`)
  * Sidebar on left, main content area on right
  * Each page has its own header (no global header bar)

* **Sidebar:** (`w-48 bg-white border-r border-gray-200`)
  * **Top Section:** Tenant info with icon and name
    * Blue icon background (`bg-blue-600`) with Users icon
    * Title: "AGILE SCRUM Dashboard" (`text-sm font-semibold text-gray-900`)
    * Subtitle: Tenant display name (`text-xs text-gray-500`)
  * **Navigation Links:**
    * **Active:** `bg-blue-600 text-white font-medium`
    * **Inactive:** `text-gray-700 hover:bg-gray-100`
    * Icons and labels in horizontal layout
  * **Footer Section:** Multi-tenant info message
    * "Multi-Tenant SaaS" in blue (`text-blue-600 font-medium`)
    * Description in gray (`text-gray-500`)
  * **Links:** Kanban Board, Daily Check-In, Admin Analytics (only visible if `isAdmin`)

* **Page Headers:** (Applied per-page)
  * White background with bottom border (`bg-white border-b border-gray-200`)
  * Padding: `px-6 py-4`
  * Title: `text-2xl font-bold text-gray-900`
  * Subtitle: `text-sm text-gray-600 mt-1`
  * Action buttons aligned to the right

### **C. Kanban Board (`/dashboard`)**

* **Page Structure:**
  * White header bar with title and "New Task" button (`bg-blue-600 hover:bg-blue-700`)
  * Scrollable content area with horizontal columns

* **Columns:** (`w-64 flex-shrink-0`)
  * **Header:** White background with colored bottom border (4px)
    * Title: `text-sm font-semibold text-gray-900`
    * Count badge: `text-xs text-gray-500`
  * **Content Area:** `bg-gray-50` with vertical task list
  * **Drag Feedback:** Highlights blue (`bg-blue-50`) when hovering during drag

* **Task Card:**
  * White background (`bg-white border-gray-200 shadow-sm`)
  * Title: `text-sm font-medium text-gray-900`
  * Priority Badge: Colored pill (low/medium/high/critical variants)
  * Metadata: `text-xs text-gray-600` (story points, assignee)
  * **Blocker Alert:** Red AlertCircle icon if status="blocked"
  * **Interaction:**
    * Draggable using `@dnd-kit/core` with 8px activation distance
    * Cursor changes: `cursor-grab active:cursor-grabbing`
    * Click opens Edit Modal
    * Drag overlay shows rotated card during drag

* **Task Modal (Dialog):**
  * Fields: Title, Description, Priority (Select), Status, Story Points (Select), Assignee
  * **Conditional Field:** If Status is "Blocked", show a Textarea for "Blocker Details"

* **Logic:**
  * Dragging a card to a new column updates `status` in Store/DB immediately
  * Visual feedback during drag with DragOverlay component

### **D. Daily Check-In (`/check-in`)**

* **Page Structure:**
  * White header bar with title and conditional "New Check-In" button
  * Button only shows if user hasn't checked in today (`bg-blue-600 hover:bg-blue-700`)
  * Scrollable content area with max-width container

* **Top Section (Status Card):**
  * **If submitted today:** Green card (`bg-green-50 border-green-200`)
    * Icon: Green circle with CheckCircle (`bg-green-500 w-10 h-10`)
    * Title: "Check-in submitted today" (`text-green-900 font-semibold`)
    * Subtitle: "Great job staying on track!" (`text-green-700`)
  * **If not submitted:** Blue card (`bg-blue-50 border-blue-200`)
    * Icon: Blue circle with AlertCircle (`bg-blue-500 w-10 h-10`)
    * Title: "You haven't checked in today" (`text-blue-900 font-semibold`)
    * Subtitle: "Submit your daily standup update" (`text-blue-700`)
    * Button: "Submit Check-In" on the right

* **Form (Dialog Modal):**
  * Opens when "Submit Check-In" or "New Check-In" clicked
  * Fields: Sprint Week, Yesterday's Work, Today's Plan, Impediments, Help Needed
  * Read-only fields: Date (Today), Student Name

* **History View (Two-Column Grid):**
  * **My Check-Ins Card:**
    * Title: "My Check-Ins" (`text-lg text-gray-900`)
    * Description: "Your standup history" (`text-sm text-gray-600`)
    * Empty state: Centered ClipboardCheck icon with "No check-ins yet"
  * **Team Check-Ins Card:**
    * Title: "Team Check-Ins"
    * Description: "Recent updates from your team"
    * Empty state: "No team check-ins yet"
  * **Check-in Items:**
    * Left border accent: `border-l-4 border-blue-600`
    * Username: `text-sm font-semibold text-gray-900`
    * Date: `text-xs text-gray-500`
    * Content: `text-sm text-gray-700` with bold labels

### **E. Admin Analytics (`/admin`)**

* **Page Structure:**
  * White header bar with title and Tenant Filter dropdown on the right
  * Scrollable content area with responsive grid layouts

* **Access Control:** Redirects non-admin users to `/dashboard`

* **KPI Cards:** (4-column grid, responsive to 2-col on md, 1-col on mobile)
  * White cards with colored icon backgrounds:
    * Total Tasks: Blue (`text-blue-600 bg-blue-100`)
    * Total Story Points: Green (`text-green-600 bg-green-100`)
    * Active Students: Purple (`text-purple-600 bg-purple-100`)
    * Total Check-Ins: Amber (`text-amber-600 bg-amber-100`)
  * Large numeric values with descriptive labels

* **Filtering:**
  * Tenant Filter dropdown in page header
  * Options: "All" or specific tenant (e.g., "Walmart")
  * Updates all KPIs and tables dynamically

* **Tables:** (2-column grid on large screens)
  * **Tenant Overview:**
    * Shows when "All" filter selected
    * Columns: Tenant Name, User Count, Task Count, Check-In Count
  * **User Participation Leaderboard:**
    * Top 10 users by check-in count
    * Responsive to filter selection

* **Loading State:**
  * Centered spinner with blue accent (`border-blue-600`)
  * Gray text: "Loading analytics..." (`text-gray-600`)

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
