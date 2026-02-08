import { create } from 'zustand';
import { UserSession, TenantId } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getUserTenantMembership, createTenantMembership } from '@/lib/supabase/queries/users';

interface AuthState {
  session: UserSession | null;
  loading: boolean;
  setSession: (session: UserSession | null) => void;
  login: (email: string, password: string) => Promise<{ needsTenantSelection: boolean; error?: string }>;
  selectTenant: (userId: string, tenantId: TenantId, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session, loading: false }),

  login: async (email, password) => {
    const supabase = createClient();
    
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return { needsTenantSelection: false, error: authError.message };
      }

      if (!authData.user) {
        return { needsTenantSelection: false, error: 'Login failed' };
      }

      // Check if user has tenant membership
      const membership = await getUserTenantMembership(supabase, authData.user.id);

      if (!membership) {
        // New user - needs tenant selection
        return { needsTenantSelection: true };
      }

      // Existing user - set session
      const session: UserSession = {
        userId: authData.user.id,
        username: authData.user.email?.split('@')[0] || 'User',
        displayName: authData.user.user_metadata?.display_name || authData.user.email?.split('@')[0] || 'User',
        tenantId: membership.tenant_id as TenantId,
        role: membership.role,
      };

      set({ session, loading: false });
      return { needsTenantSelection: false };
    } catch (error) {
      console.error('Login error:', error);
      return { needsTenantSelection: false, error: 'An unexpected error occurred' };
    }
  },

  selectTenant: async (userId, tenantId, displayName) => {
    const supabase = createClient();
    
    try {
      // Create tenant membership
      const membership = await createTenantMembership(supabase, userId, tenantId);

      // Update user metadata with display name
      await supabase.auth.updateUser({
        data: { display_name: displayName },
      });

      // Set session
      const session: UserSession = {
        userId,
        username: displayName,
        displayName,
        tenantId: membership.tenant_id as TenantId,
        role: membership.role,
      };

      set({ session, loading: false });
    } catch (error) {
      console.error('Select tenant error:', error);
      throw error;
    }
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ session: null, loading: false });
  },

  checkAuth: async () => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ session: null, loading: false });
        return;
      }

      // Get tenant membership
      const membership = await getUserTenantMembership(supabase, user.id);

      if (!membership) {
        // User exists but no tenant - should redirect to tenant selection
        set({ session: null, loading: false });
        return;
      }

      const session: UserSession = {
        userId: user.id,
        username: user.email?.split('@')[0] || 'User',
        displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        tenantId: membership.tenant_id as TenantId,
        role: membership.role,
      };

      set({ session, loading: false });
    } catch (error) {
      console.error('Check auth error:', error);
      set({ session: null, loading: false });
    }
  },
}));
