import { create } from 'zustand';
import { Task, TenantId, TaskDB } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/supabase/queries/tasks';
import { mapTaskFromDB, mapTaskToDB } from '@/lib/utils/data-mappers';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  loadTasks: (tenantId: TenantId) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,

  loadTasks: async (tenantId) => {
    set({ loading: true });
    const supabase = createClient();

    try {
      const tasksDB = await getTasks(supabase, tenantId);
      const tasks = tasksDB.map(mapTaskFromDB);
      set({ tasks, loading: false });
    } catch (error) {
      console.error('Error loading tasks:', error);
      set({ loading: false });
    }
  },

  addTask: async (task) => {
    const supabase = createClient();

    try {
      const taskDB = mapTaskToDB(task) as Omit<TaskDB, 'id' | 'created_at'>;
      const newTaskDB = await createTask(supabase, taskDB);
      const newTask = mapTaskFromDB(newTaskDB);

      set((state) => ({
        tasks: [newTask, ...state.tasks],
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    const supabase = createClient();

    try {
      const taskDB = mapTaskToDB(updates);
      const updatedTaskDB = await updateTask(supabase, id, taskDB);
      const updatedTask = mapTaskFromDB(updatedTaskDB);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTask : task
        ),
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    const supabase = createClient();

    try {
      await deleteTask(supabase, id);

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
}));
