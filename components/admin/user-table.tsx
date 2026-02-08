'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserStat {
  userId: string;
  displayName: string;
  count: number;
}

interface UserTableProps {
  stats: UserStat[];
  title: string;
}

export function UserTable({ stats, title }: UserTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-sm">Rank</th>
                <th className="pb-3 font-semibold text-sm">User</th>
                <th className="pb-3 font-semibold text-sm text-right">
                  Check-Ins
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat, index) => (
                <tr key={stat.userId} className="border-b last:border-0">
                  <td className="py-3 text-sm">
                    {index === 0 && (
                      <Badge variant="default" className="w-8 h-8 flex items-center justify-center rounded-full">
                        1
                      </Badge>
                    )}
                    {index === 1 && (
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center rounded-full">
                        2
                      </Badge>
                    )}
                    {index === 2 && (
                      <Badge variant="outline" className="w-8 h-8 flex items-center justify-center rounded-full">
                        3
                      </Badge>
                    )}
                    {index > 2 && (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </td>
                  <td className="py-3 text-sm font-medium">
                    {stat.displayName}
                  </td>
                  <td className="py-3 text-sm text-right">{stat.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
