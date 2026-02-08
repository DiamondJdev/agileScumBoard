import { SupabaseClient } from '@supabase/supabase-js';
import { DailyCheckInDB, TenantId } from '@/lib/types';

/**
 * Fetch all check-ins for a specific tenant
 */
export async function getCheckIns(
  supabase: SupabaseClient,
  tenantId: TenantId
): Promise<DailyCheckInDB[]> {
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching check-ins:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch check-ins for a specific user
 */
export async function getUserCheckIns(
  supabase: SupabaseClient,
  userId: string
): Promise<DailyCheckInDB[]> {
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user check-ins:', error);
    throw error;
  }

  return data || [];
}

/**
 * Check if user has checked in today
 */
export async function hasCheckedInToday(
  supabase: SupabaseClient,
  userId: string,
  date: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('user_id', userId)
    .eq('date', date)
    .limit(1);

  if (error) {
    console.error('Error checking daily check-in:', error);
    return false;
  }

  return (data?.length || 0) > 0;
}

/**
 * Create a new daily check-in
 */
export async function createCheckIn(
  supabase: SupabaseClient,
  checkIn: Omit<DailyCheckInDB, 'id' | 'created_at'>
): Promise<DailyCheckInDB> {
  const { data, error } = await supabase
    .from('daily_checkins')
    .insert(checkIn)
    .select()
    .single();

  if (error) {
    console.error('Error creating check-in:', error);
    throw error;
  }

  return data;
}

/**
 * Get check-in count by user (for leaderboard)
 */
export async function getCheckInCountsByUser(
  supabase: SupabaseClient,
  tenantId?: TenantId
): Promise<{ userId: string; displayName: string; count: number }[]> {
  let query = supabase
    .from('daily_checkins')
    .select('user_id, display_name');

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching check-in counts:', error);
    throw error;
  }

  // Group by user and count
  const counts = new Map<string, { displayName: string; count: number }>();
  
  data?.forEach((item) => {
    const existing = counts.get(item.user_id);
    if (existing) {
      existing.count++;
    } else {
      counts.set(item.user_id, {
        displayName: item.display_name || 'Unknown',
        count: 1,
      });
    }
  });

  return Array.from(counts.entries()).map(([userId, data]) => ({
    userId,
    displayName: data.displayName,
    count: data.count,
  }));
}

/**
 * Get total check-in count
 */
export async function getTotalCheckIns(
  supabase: SupabaseClient,
  tenantId?: TenantId
): Promise<number> {
  let query = supabase
    .from('daily_checkins')
    .select('id', { count: 'exact', head: true });

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error fetching check-in count:', error);
    return 0;
  }

  return count || 0;
}
