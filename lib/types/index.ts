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
  role: 'student' | 'admin';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  storyPoints: number;
  assignee: string;
  assigneeId?: string;
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
  createdAt: string;
}

// Database table types (snake_case)
export interface TaskDB {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  story_points: number;
  assignee_id: string | null;
  assignee_name: string | null;
  blocker_details: string | null;
  created_at: string;
}

export interface DailyCheckInDB {
  id: string;
  tenant_id: string;
  user_id: string;
  date: string;
  sprint_week: string;
  yesterday: string;
  today: string;
  impediments: string;
  help_needed: string;
  display_name: string | null;
  created_at: string;
}

export interface TenantMemberDB {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'student' | 'admin';
  created_at: string;
}
