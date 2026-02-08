import { SupabaseClient } from '@supabase/supabase-js';
import { TenantMemberDB, TenantId } from '@/lib/types';

/**
 * Get user's tenant membership
 */
export async function getUserTenantMembership(
  supabase: SupabaseClient,
  userId: string
): Promise<TenantMemberDB | null> {
  const { data, error } = await supabase
    .from('tenant_members')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user tenant membership:', error);
    return null;
  }

  return data;
}

/**
 * Create tenant membership for a user
 */
export async function createTenantMembership(
  supabase: SupabaseClient,
  userId: string,
  tenantId: TenantId,
  role: 'student' | 'admin' = 'student'
): Promise<TenantMemberDB> {
  const { data, error } = await supabase
    .from('tenant_members')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      role,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating tenant membership:', error);
    throw error;
  }

  return data;
}

/**
 * Get all users in a tenant
 */
export async function getTenantUsers(
  supabase: SupabaseClient,
  tenantId: TenantId
): Promise<TenantMemberDB[]> {
  const { data, error } = await supabase
    .from('tenant_members')
    .select('*')
    .eq('tenant_id', tenantId);

  if (error) {
    console.error('Error fetching tenant users:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get active student count
 */
export async function getActiveStudentCount(
  supabase: SupabaseClient,
  tenantId?: TenantId
): Promise<number> {
  let query = supabase
    .from('tenant_members')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'student');

  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error fetching student count:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Get tenant statistics for admin dashboard
 */
export async function getTenantStats(
  supabase: SupabaseClient
): Promise<{ tenantId: string; tenantName: string; userCount: number }[]> {
  const { data: tenants, error: tenantsError } = await supabase
    .from('tenants')
    .select('id, name');

  if (tenantsError) {
    console.error('Error fetching tenants:', tenantsError);
    return [];
  }

  const { data: members, error: membersError } = await supabase
    .from('tenant_members')
    .select('tenant_id');

  if (membersError) {
    console.error('Error fetching members:', membersError);
    return [];
  }

  // Count members by tenant
  const memberCounts = new Map<string, number>();
  members?.forEach((member) => {
    const count = memberCounts.get(member.tenant_id) || 0;
    memberCounts.set(member.tenant_id, count + 1);
  });

  return tenants?.map((tenant) => ({
    tenantId: tenant.id,
    tenantName: tenant.name,
    userCount: memberCounts.get(tenant.id) || 0,
  })) || [];
}
