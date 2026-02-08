import { create } from 'zustand';
import { DailyCheckIn, TenantId, DailyCheckInDB } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getCheckIns, getUserCheckIns, hasCheckedInToday, createCheckIn } from '@/lib/supabase/queries/checkins';
import { mapCheckInFromDB, mapCheckInToDB } from '@/lib/utils/data-mappers';

interface CheckInState {
  checkIns: DailyCheckIn[];
  userCheckIns: DailyCheckIn[];
  loading: boolean;
  hasCheckedInToday: boolean;
  loadCheckIns: (tenantId: TenantId) => Promise<void>;
  loadUserCheckIns: (userId: string) => Promise<void>;
  checkHasCheckedInToday: (userId: string, date: string) => Promise<void>;
  submitCheckIn: (checkIn: Omit<DailyCheckIn, 'id' | 'createdAt'>) => Promise<void>;
}

export const useCheckInStore = create<CheckInState>((set) => ({
  checkIns: [],
  userCheckIns: [],
  loading: false,
  hasCheckedInToday: false,

  loadCheckIns: async (tenantId) => {
    set({ loading: true });
    const supabase = createClient();

    try {
      const checkInsDB = await getCheckIns(supabase, tenantId);
      const checkIns = checkInsDB.map(mapCheckInFromDB);
      set({ checkIns, loading: false });
    } catch (error) {
      console.error('Error loading check-ins:', error);
      set({ loading: false });
    }
  },

  loadUserCheckIns: async (userId) => {
    const supabase = createClient();

    try {
      const checkInsDB = await getUserCheckIns(supabase, userId);
      const userCheckIns = checkInsDB.map(mapCheckInFromDB);
      set({ userCheckIns });
    } catch (error) {
      console.error('Error loading user check-ins:', error);
    }
  },

  checkHasCheckedInToday: async (userId, date) => {
    const supabase = createClient();

    try {
      const hasChecked = await hasCheckedInToday(supabase, userId, date);
      set({ hasCheckedInToday: hasChecked });
    } catch (error) {
      console.error('Error checking today check-in:', error);
      set({ hasCheckedInToday: false });
    }
  },

  submitCheckIn: async (checkIn) => {
    const supabase = createClient();

    try {
      const checkInDB = mapCheckInToDB(checkIn) as Omit<DailyCheckInDB, 'id' | 'created_at'>;
      const newCheckInDB = await createCheckIn(supabase, checkInDB);
      const newCheckIn = mapCheckInFromDB(newCheckInDB);

      set((state) => ({
        checkIns: [newCheckIn, ...state.checkIns],
        userCheckIns: [newCheckIn, ...state.userCheckIns],
        hasCheckedInToday: true,
      }));
    } catch (error) {
      console.error('Error submitting check-in:', error);
      throw error;
    }
  },
}));
