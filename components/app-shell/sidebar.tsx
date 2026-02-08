'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckCircle, BarChart3, Users } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { TENANTS } from '@/lib/constants/tenants';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const session = useAuthStore((state) => state.session);
  
  const isAdmin = session?.role === 'admin';
  const tenant = TENANTS.find((t) => t.id === session?.tenantId);

  const navItems = [
    {
      name: 'Kanban Board',
      href: '/dashboard',
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Daily Check-In',
      href: '/check-in',
      icon: CheckCircle,
      show: true,
    },
    {
      name: 'Admin Analytics',
      href: '/admin',
      icon: BarChart3,
      show: isAdmin,
    },
  ];

  return (
    <aside className="w-48 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Tenant Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">
              AGILE SCRUM Dashboard
            </div>
            <div className="text-xs text-gray-500 truncate">
              {tenant?.displayName || 'Tenant'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          if (!item.show) return null;
          
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm',
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-blue-600 font-medium">
          Multi-Tenant SaaS
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          Tenant data is isolated and persisted locally.
        </div>
      </div>
    </aside>
  );
}
