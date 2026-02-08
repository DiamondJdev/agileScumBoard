'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatusCardProps {
  hasCheckedIn: boolean;
  onCheckIn: () => void;
}

export function StatusCard({ hasCheckedIn, onCheckIn }: StatusCardProps) {
  if (hasCheckedIn) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Check-in submitted today</h3>
              <p className="text-sm text-green-700">
                Great job staying on track!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">You haven&apos;t checked in today</h3>
              <p className="text-sm text-blue-700">
                Submit your daily standup update
              </p>
            </div>
          </div>
          <Button onClick={onCheckIn} className="bg-blue-600 hover:bg-blue-700">Submit Check-In</Button>
        </div>
      </CardContent>
    </Card>
  );
}
