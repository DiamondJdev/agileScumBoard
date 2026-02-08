import { SupabaseClient } from '@supabase/supabase-js';
import { TaskDB, TenantId } from '@/lib/types';

/**
 * Fetch all tasks for a specific tenant
 */
export async function getTasks(
  supabase: SupabaseClient,
  tenantId: TenantId
): Promise<TaskDB[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data || [];
}

/**
 * Create a new task
 */
export async function createTask(
  supabase: SupabaseClient,
  task: Omit<TaskDB, 'id' | 'created_at'>
): Promise<TaskDB> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
}

/**
 * Update an existing task
 */
export async function updateTask(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<TaskDB>
): Promise<TaskDB> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a task
 */
export async function deleteTask(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/**
 * Get task statistics for admin
 */
export async function getTaskStats(
  supabase: SupabaseClient,
  tenantId?: TenantId
): Promise<{ totalTasks: number; totalStoryPoints: number }> {
  let query = supabase
    .from('tasks')
    .select('story_points');

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching task stats:', error);
    throw error;
  }

  const totalTasks = data?.length || 0;
  const totalStoryPoints = data?.reduce((sum, task) => sum + (task.story_points || 0), 0) || 0;

  return { totalTasks, totalStoryPoints };
}
