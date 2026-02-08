'use client';

import React from 'react';
import { Task, TaskPriority } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const priorityVariant: Record<TaskPriority, 'low' | 'medium' | 'high' | 'critical'> = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical',
  };

  const { attributes, listeners, setNodeRef, transform, isDragging: isActiveDrag } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: 'none'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300',
        'relative',
        isActiveDrag && 'cursor-grabbing shadow-2xl scale-105 ring-2 ring-blue-400'
      )}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className={cn(
          'absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center',
          'cursor-grab active:cursor-grabbing',
          'opacity-0 group-hover:opacity-100 transition-opacity',
          'bg-gradient-to-r from-gray-100 to-transparent',
          'rounded-l-lg'
        )}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      {/* Card Content */}
      <div
        onClick={onClick}
        className="p-4 pl-10 cursor-pointer"
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
    </div>
  );
}
