'use client';

import React from 'react';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  color: string;
}

const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-700',
  },
};

export function KanbanColumn({
  status,
  title,
  tasks,
  onTaskClick,
  color,
}: KanbanColumnProps) {
  const colors = colorClasses[color] || colorClasses.gray;

  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col w-64 flex-shrink-0">
      <div
        className={cn(
          'px-4 py-3 border-b-4',
          colors.border,
          'bg-white'
        )}
      >
        <h2 className="font-semibold text-sm text-gray-900">
          {title}
        </h2>
        <p className="text-xs text-gray-500 mt-1">{tasks.length}</p>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 space-y-3 min-h-[500px] transition-all duration-200',
          isOver 
            ? 'bg-blue-50 ring-2 ring-blue-400 ring-inset' 
            : 'bg-gray-50'
        )}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
}
