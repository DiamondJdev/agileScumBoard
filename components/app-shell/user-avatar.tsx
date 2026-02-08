'use client';

import React from 'react';

interface UserAvatarProps {
  displayName: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ displayName, size = 'md' }: UserAvatarProps) {
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold`}
    >
      {initials}
    </div>
  );
}
