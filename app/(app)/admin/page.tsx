'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { KPICard } from '@/components/admin/kpi-card';
import { TenantFilter } from '@/components/admin/tenant-filter';
import { TenantTable } from '@/components/admin/tenant-table';
import { UserTable } from '@/components/admin/user-table';
import { LayoutDashboard, CheckCircle, Users, ListTodo } from 'lucide-react';
import { TenantId } from '@/lib/types';
import {
  getTenantStats,
  getActiveStudentCount,
} from '@/lib/supabase/queries/users';
import {
  getTaskStats,
} from '@/lib/supabase/queries/tasks';
import {
  getTotalCheckIns,
  getCheckInCountsByUser,
} from '@/lib/supabase/queries/checkins';

interface TenantStat {
  tenantId: string;
  tenantName: string;
  userCount: number;
  taskCount?: number;
  checkInCount?: number;
}

interface UserStat {
  userId: string;
  displayName: string;
  count: number;
}

export default function AdminPage() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const [selectedTenant, setSelectedTenant] = useState<TenantId | 'all'>('all');
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalStoryPoints: 0,
    activeStudents: 0,
    totalCheckIns: 0,
  });
  
  const [tenantStats, setTenantStats] = useState<TenantStat[]>([]);
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Check admin access
  useEffect(() => {
    if (session && session.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Load stats
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const supabase = createClient();

      try {
        const tenantFilter = selectedTenant === 'all' ? undefined : selectedTenant;

        // Load KPIs
        const [taskData, checkInCount, studentCount] = await Promise.all([
          getTaskStats(supabase, tenantFilter),
          getTotalCheckIns(supabase, tenantFilter),
          getActiveStudentCount(supabase, tenantFilter),
        ]);

        setStats({
          totalTasks: taskData.totalTasks,
          totalStoryPoints: taskData.totalStoryPoints,
          activeStudents: studentCount,
          totalCheckIns: checkInCount,
        });

        // Load tenant stats (only when viewing all)
        if (selectedTenant === 'all') {
          const tenantData = await getTenantStats(supabase);
          setTenantStats(tenantData);
        }

        // Load user stats
        const userCheckInCounts = await getCheckInCountsByUser(supabase, tenantFilter);
        setUserStats(
          userCheckInCounts.sort((a, b) => b.count - a.count).slice(0, 10)
        );
      } catch (error) {
        console.error('Error loading admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.role === 'admin') {
      loadStats();
    }
  }, [session, selectedTenant]);

  if (session?.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor team performance and engagement across tenants
            </p>
          </div>
          <TenantFilter value={selectedTenant} onChange={setSelectedTenant} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={ListTodo}
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <KPICard
            title="Total Story Points"
            value={stats.totalStoryPoints}
            icon={LayoutDashboard}
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <KPICard
            title="Active Students"
            value={stats.activeStudents}
            icon={Users}
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <KPICard
            title="Total Check-Ins"
            value={stats.totalCheckIns}
            icon={CheckCircle}
            iconColor="text-amber-600"
            iconBg="bg-amber-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedTenant === 'all' && (
            <TenantTable stats={tenantStats} />
          )}
          <UserTable stats={userStats} title="User Participation Leaderboard" />
        </div>
      </div>
    </div>
  );
}
