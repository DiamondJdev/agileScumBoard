import { Task, TaskDB, DailyCheckIn, DailyCheckInDB, TenantId } from '@/lib/types';

/**
 * Convert database Task (snake_case) to frontend Task (camelCase)
 */
export function mapTaskFromDB(taskDB: TaskDB): Task {
  return {
    id: taskDB.id,
    title: taskDB.title,
    description: taskDB.description,
    priority: taskDB.priority,
    status: taskDB.status,
    storyPoints: taskDB.story_points,
    assignee: taskDB.assignee_name || 'Unassigned',
    assigneeId: taskDB.assignee_id || undefined,
    blockerDetails: taskDB.blocker_details || undefined,
    createdAt: taskDB.created_at,
    tenantId: taskDB.tenant_id as TenantId,
  };
}

/**
 * Convert frontend Task (camelCase) to database Task (snake_case)
 */
export function mapTaskToDB(task: Partial<Task>): Partial<TaskDB> {
  const mapped: Partial<TaskDB> = {};
  
  if (task.id) mapped.id = task.id;
  if (task.title) mapped.title = task.title;
  if (task.description !== undefined) mapped.description = task.description;
  if (task.priority) mapped.priority = task.priority;
  if (task.status) mapped.status = task.status;
  if (task.storyPoints !== undefined) mapped.story_points = task.storyPoints;
  if (task.assigneeId !== undefined) mapped.assignee_id = task.assigneeId || null;
  if (task.assignee !== undefined) mapped.assignee_name = task.assignee;
  if (task.blockerDetails !== undefined) mapped.blocker_details = task.blockerDetails || null;
  if (task.tenantId) mapped.tenant_id = task.tenantId;
  
  return mapped;
}

/**
 * Convert database DailyCheckIn (snake_case) to frontend DailyCheckIn (camelCase)
 */
export function mapCheckInFromDB(checkInDB: DailyCheckInDB): DailyCheckIn {
  return {
    id: checkInDB.id,
    userId: checkInDB.user_id,
    date: checkInDB.date,
    sprintWeek: checkInDB.sprint_week,
    username: checkInDB.display_name || 'Unknown',
    whatIDidYesterday: checkInDB.yesterday,
    whatIAmDoingToday: checkInDB.today,
    impediments: checkInDB.impediments,
    helpNeeded: checkInDB.help_needed,
    tenantId: checkInDB.tenant_id as TenantId,
    createdAt: checkInDB.created_at,
  };
}

/**
 * Convert frontend DailyCheckIn (camelCase) to database DailyCheckIn (snake_case)
 */
export function mapCheckInToDB(checkIn: Partial<DailyCheckIn>): Partial<DailyCheckInDB> {
  const mapped: Partial<DailyCheckInDB> = {};
  
  if (checkIn.id) mapped.id = checkIn.id;
  if (checkIn.userId) mapped.user_id = checkIn.userId;
  if (checkIn.date) mapped.date = checkIn.date;
  if (checkIn.sprintWeek) mapped.sprint_week = checkIn.sprintWeek;
  if (checkIn.username) mapped.display_name = checkIn.username;
  if (checkIn.whatIDidYesterday !== undefined) mapped.yesterday = checkIn.whatIDidYesterday;
  if (checkIn.whatIAmDoingToday !== undefined) mapped.today = checkIn.whatIAmDoingToday;
  if (checkIn.impediments !== undefined) mapped.impediments = checkIn.impediments;
  if (checkIn.helpNeeded !== undefined) mapped.help_needed = checkIn.helpNeeded;
  if (checkIn.tenantId) mapped.tenant_id = checkIn.tenantId;
  
  return mapped;
}
