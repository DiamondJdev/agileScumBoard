import { Tenant } from '@/lib/types';

export const TENANTS: Tenant[] = [
  {
    id: 'walmart',
    name: 'walmart',
    displayName: 'Walmart',
  },
  {
    id: '3c-consulting',
    name: '3c-consulting',
    displayName: '3C Consulting',
  },
  {
    id: 'primary-battery-tech',
    name: 'primary-battery-tech',
    displayName: 'Primary Battery Technology',
  },
  {
    id: 'wac-amp',
    name: 'wac-amp',
    displayName: 'WAC AMP',
  },
  {
    id: 'cob',
    name: 'cob',
    displayName: 'COB',
  },
  {
    id: 'echelon',
    name: 'echelon',
    displayName: 'Echelon',
  },
  {
    id: 'arvest',
    name: 'arvest',
    displayName: 'Arvest',
  },
  {
    id: 'startup-lab',
    name: 'startup-lab',
    displayName: 'Startup Lab',
  },
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Admin',
    isAdmin: true,
  },
];

export const STORY_POINTS = [1, 2, 3, 5, 8, 13, 21];

export const TASK_PRIORITIES: { value: string; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const TASK_STATUSES: { value: string; label: string; color: string }[] = [
  { value: 'backlog', label: 'Backlog', color: 'gray' },
  { value: 'todo', label: 'To Do', color: 'blue' },
  { value: 'in-progress', label: 'In Progress', color: 'amber' },
  { value: 'blocked', label: 'Blocked', color: 'red' },
  { value: 'done', label: 'Done', color: 'green' },
];
