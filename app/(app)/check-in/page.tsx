'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCheckInStore } from '@/lib/stores/checkin-store';
import { StatusCard } from '@/components/checkin/status-card';
import { CheckInForm } from '@/components/checkin/form';
import { HistoryList } from '@/components/checkin/history-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getTodayDate } from '@/lib/utils/date';

export default function CheckInPage() {
  const session = useAuthStore((state) => state.session);
  const hasCheckedInToday = useCheckInStore((state) => state.hasCheckedInToday);
  const checkIns = useCheckInStore((state) => state.checkIns);
  const userCheckIns = useCheckInStore((state) => state.userCheckIns);
  const loadCheckIns = useCheckInStore((state) => state.loadCheckIns);
  const loadUserCheckIns = useCheckInStore((state) => state.loadUserCheckIns);
  const checkHasCheckedInToday = useCheckInStore((state) => state.checkHasCheckedInToday);
  const submitCheckIn = useCheckInStore((state) => state.submitCheckIn);

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (session?.tenantId) {
      loadCheckIns(session.tenantId);
    }
    if (session?.userId) {
      loadUserCheckIns(session.userId);
      checkHasCheckedInToday(session.userId, getTodayDate());
    }
  }, [session, loadCheckIns, loadUserCheckIns, checkHasCheckedInToday]);

  const handleSubmit = async (data: {
    sprintWeek: string;
    yesterday: string;
    today: string;
    impediments: string;
    helpNeeded: string;
  }) => {
    if (!session) return;

    await submitCheckIn({
      userId: session.userId,
      date: getTodayDate(),
      sprintWeek: data.sprintWeek,
      whatIDidYesterday: data.yesterday,
      whatIAmDoingToday: data.today,
      impediments: data.impediments,
      helpNeeded: data.helpNeeded,
      username: session.displayName,
      tenantId: session.tenantId,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Check-In</h1>
            <p className="text-sm text-gray-600 mt-1">
              Share your daily standup updates with your team
            </p>
          </div>
          {!hasCheckedInToday && (
            <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Check-In
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <StatusCard
            hasCheckedIn={hasCheckedInToday}
            onCheckIn={() => setIsFormOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HistoryList
              checkIns={userCheckIns}
              title="My Check-Ins"
            />
            <HistoryList
              checkIns={checkIns.filter((c) => c.userId !== session?.userId)}
              title="Team Check-Ins"
            />
          </div>
        </div>
      </div>

      <CheckInForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        displayName={session?.displayName || ''}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
