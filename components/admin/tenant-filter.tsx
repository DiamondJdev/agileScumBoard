'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TENANTS } from '@/lib/constants/tenants';
import { TenantId } from '@/lib/types';

interface TenantFilterProps {
  value: TenantId | 'all';
  onChange: (value: TenantId | 'all') => void;
}

export function TenantFilter({ value, onChange }: TenantFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Filter by Tenant:</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tenants</SelectItem>
          {TENANTS.filter(t => !t.isAdmin).map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.id}>
              {tenant.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
