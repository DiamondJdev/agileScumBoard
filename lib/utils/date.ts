/**
 * Get the current date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date for display (short)
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get current sprint week (e.g., "Sprint 1 - Week 2")
 * This is a placeholder - implement your own logic based on sprint schedule
 */
export function getCurrentSprintWeek(): string {
  // For now, calculate based on the current week of the year
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const week = Math.ceil(dayOfYear / 7);
  
  // Assume 2-week sprints, starting from week 1 of the year
  const sprintNumber = Math.ceil(week / 2);
  const weekInSprint = week % 2 === 0 ? 2 : 1;
  
  return `Sprint ${sprintNumber} - Week ${weekInSprint}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: string, date2: string): boolean {
  return date1.split('T')[0] === date2.split('T')[0];
}
