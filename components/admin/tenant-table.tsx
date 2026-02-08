'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface TenantStats {
  tenantId: string;
  tenantName: string;
  userCount: number;
  taskCount?: number;
  checkInCount?: number;
}

interface TenantTableProps {
  stats: TenantStats[];
}

export function TenantTable({ stats }: TenantTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenant Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-sm">Tenant</th>
                <th className="pb-3 font-semibold text-sm text-right">Users</th>
                <th className="pb-3 font-semibold text-sm text-right">Tasks</th>
                <th className="pb-3 font-semibold text-sm text-right">Check-Ins</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.tenantId} className="border-b last:border-0">
                  <td className="py-3 text-sm">{stat.tenantName}</td>
                  <td className="py-3 text-sm text-right">{stat.userCount}</td>
                  <td className="py-3 text-sm text-right">
                    {stat.taskCount || 0}
                  </td>
                  <td className="py-3 text-sm text-right">
                    {stat.checkInCount || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
