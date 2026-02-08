'use client';

import React from 'react';
import { Task, TaskPriority } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isDragging = false }: TaskCardProps) {
  const priorityVariant: Record<TaskPriority, 'low' | 'medium' | 'high' | 'critical'> = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical',
  };

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        'bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-md',
        isDragging && 'opacity-50'
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 flex-1">{task.title}</h3>
          {task.status === 'blocked' && (
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={priorityVariant[task.priority]}>
            {task.priority.toUpperCase()}
          </Badge>
          <span className="text-xs text-gray-600">
            {task.storyPoints} pts
          </span>
        </div>

        <div className="text-xs text-gray-600">
          Assignee: {task.assignee}
        </div>
      </div>
    </div>
  );
}
