'use client';

import React from 'react';
import { DailyCheckIn } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils/date';
import { ClipboardCheck } from 'lucide-react';

interface HistoryListProps {
  checkIns: DailyCheckIn[];
  title: string;
}

export function HistoryList({ checkIns, title }: HistoryListProps) {
  const description = title === "My Check-Ins" ? "Your standup history" : "Recent updates from your team";
  const emptyMessage = title === "My Check-Ins" ? "No check-ins yet" : "No team check-ins yet";

  if (checkIns.length === 0) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checkIns.slice(0, 5).map((checkIn) => (
            <div
              key={checkIn.id}
              className="border-l-4 border-blue-600 pl-4 py-2 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-gray-900">{checkIn.username}</h4>
                <span className="text-xs text-gray-500">
                  {formatDate(checkIn.date)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {checkIn.sprintWeek}
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-900">Yesterday:</span>{' '}
                  {checkIn.whatIDidYesterday}
                </div>
                <div>
                  <span className="font-medium text-gray-900">Today:</span>{' '}
                  {checkIn.whatIAmDoingToday}
                </div>
                {checkIn.impediments && (
                  <div>
                    <span className="font-medium text-gray-900">Impediments:</span>{' '}
                    {checkIn.impediments}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
