import { describe, it, expect } from 'vitest';
import {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  getTasksByStatus,
  getTaskStats,
  validateTask
} from '../../utils/taskHelpers';

describe('Task Helper Functions', () => {
  const mockTasks = [
    {
      id: '1',
      title: 'Task 1',
      description: 'Description 1',
      status: 'todo',
      priority: 'High',
      category: 'Bug',
      attachments: []
    },
    {
      id: '2',
      title: 'Task 2',
      description: 'Description 2',
      status: 'in-progress',
      priority: 'Medium',
      category: 'Feature',
      attachments: []
    },
    {
      id: '3',
      title: 'Task 3',
      description: 'Description 3',
      status: 'done',
      priority: 'Low',
      category: 'Enhancement',
      attachments: []
    }
  ];

  describe('createTask', () => {
    it('should create a task with all provided data', () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'todo',
        priority: 'High',
        category: 'Bug',
        attachments: []
      };

      const result = createTask(taskData);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe('New Task');
      expect(result.description).toBe('New Description');
      expect(result.status).toBe('todo');
      expect(result.priority).toBe('High');
      expect(result.category).toBe('Bug');
    });

    it('should use default values when not provided', () => {
      const taskData = { title: 'Minimal Task' };
      const result = createTask(taskData);

      expect(result.status).toBe('todo');
      expect(result.priority).toBe('Medium');
      expect(result.category).toBe('Feature');
      expect(result.description).toBe('');
      expect(result.attachments).toEqual([]);
    });
  });

  describe('updateTask', () => {
    it('should update specific task fields', () => {
      const updates = { title: 'Updated Title', priority: 'High' };
      const result = updateTask(mockTasks, '2', updates);

      const updatedTask = result.find(t => t.id === '2');
      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.priority).toBe('High');
      expect(updatedTask.status).toBe('in-progress'); // unchanged
    });

    it('should not modify other tasks', () => {
      const updates = { title: 'Updated Title' };
      const result = updateTask(mockTasks, '2', updates);

      expect(result[0]).toEqual(mockTasks[0]);
      expect(result[2]).toEqual(mockTasks[2]);
    });
  });

  describe('deleteTask', () => {
    it('should remove task by id', () => {
      const result = deleteTask(mockTasks, '2');

      expect(result).toHaveLength(2);
      expect(result.find(t => t.id === '2')).toBeUndefined();
    });

    it('should keep other tasks intact', () => {
      const result = deleteTask(mockTasks, '2');

      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });
  });

  describe('moveTask', () => {
    it('should change task status', () => {
      const result = moveTask(mockTasks, '1', 'in-progress');

      const movedTask = result.find(t => t.id === '1');
      expect(movedTask.status).toBe('in-progress');
    });

    it('should not affect other task properties', () => {
      const result = moveTask(mockTasks, '1', 'done');

      const movedTask = result.find(t => t.id === '1');
      expect(movedTask.title).toBe('Task 1');
      expect(movedTask.priority).toBe('High');
    });
  });

  describe('getTasksByStatus', () => {
    it('should filter tasks by status', () => {
      const todoTasks = getTasksByStatus(mockTasks, 'todo');
      const inProgressTasks = getTasksByStatus(mockTasks, 'in-progress');
      const doneTasks = getTasksByStatus(mockTasks, 'done');

      expect(todoTasks).toHaveLength(1);
      expect(inProgressTasks).toHaveLength(1);
      expect(doneTasks).toHaveLength(1);
      expect(todoTasks[0].id).toBe('1');
    });

    it('should return empty array for non-existent status', () => {
      const result = getTasksByStatus(mockTasks, 'archived');
      expect(result).toEqual([]);
    });
  });

  describe('getTaskStats', () => {
    it('should calculate correct task statistics', () => {
      const stats = getTaskStats(mockTasks);

      expect(stats.todoCount).toBe(1);
      expect(stats.inProgressCount).toBe(1);
      expect(stats.doneCount).toBe(1);
      expect(stats.totalCount).toBe(3);
      expect(stats.completionRate).toBeCloseTo(33.33, 1);
    });

    it('should handle empty task array', () => {
      const stats = getTaskStats([]);

      expect(stats.totalCount).toBe(0);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe('validateTask', () => {
    it('should validate correct task', () => {
      const validTask = {
        title: 'Valid Task',
        status: 'todo',
        priority: 'High',
        category: 'Bug'
      };

      const result = validateTask(validTask);
      expect(result.valid).toBe(true);
    });

    it('should reject task without title', () => {
      const invalidTask = {
        title: '',
        status: 'todo',
        priority: 'High',
        category: 'Bug'
      };

      const result = validateTask(invalidTask);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    it('should reject task with invalid status', () => {
      const invalidTask = {
        title: 'Task',
        status: 'invalid',
        priority: 'High',
        category: 'Bug'
      };

      const result = validateTask(invalidTask);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid status');
    });

    it('should reject task with invalid priority', () => {
      const invalidTask = {
        title: 'Task',
        status: 'todo',
        priority: 'Critical',
        category: 'Bug'
      };

      const result = validateTask(invalidTask);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid priority');
    });

    it('should reject task with invalid category', () => {
      const invalidTask = {
        title: 'Task',
        status: 'todo',
        priority: 'High',
        category: 'Story'
      };

      const result = validateTask(invalidTask);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid category');
    });
  });
});
