'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useTaskStore } from '@/lib/stores/task-store';
import { Task, TaskStatus } from '@/lib/types';
import { KanbanColumn } from '@/components/kanban/column';
import { TaskModal } from '@/components/kanban/task-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TASK_STATUSES } from '@/lib/constants/tenants';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TaskCard } from '@/components/kanban/task-card';
import { useEffect } from 'react';

export default function DashboardPage() {
  const session = useAuthStore((state) => state.session);
  const tasks = useTaskStore((state) => state.tasks);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const updateTask = useTaskStore((state) => state.updateTask);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    if (session?.tenantId) {
      loadTasks(session.tenantId);
    }
  }, [session?.tenantId, loadTasks]);

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !session) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      await updateTask(taskId, { status: newStatus });
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your team&apos;s tasks and sprints
            </p>
          </div>
          <Button onClick={handleAddTask}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full min-w-max">
            {TASK_STATUSES.map((column) => (
              <KanbanColumn
                key={column.value}
                status={column.value as TaskStatus}
                title={column.label}
                tasks={tasksByStatus[column.value as TaskStatus] || []}
                onTaskClick={handleEditTask}
                color={column.color}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 opacity-80">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={selectedTask}
        onSave={async () => {
          setIsModalOpen(false);
          if (session?.tenantId) {
            await loadTasks(session.tenantId);
          }
        }}
        onDelete={selectedTask ? async () => {
          setIsModalOpen(false);
          if (session?.tenantId) {
            await loadTasks(session.tenantId);
          }
        } : undefined}
      />
    </div>
  );
}
