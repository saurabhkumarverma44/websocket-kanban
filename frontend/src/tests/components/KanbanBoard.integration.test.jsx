import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanBoard from '../../components/KanbanBoard';

// Mock socket.io-client - no top-level mockSocket
vi.mock('socket.io-client', () => {
  const mockSocket = {
    id: 'test-socket-id',
    connected: false,
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
    onAny: vi.fn(),
    offAny: vi.fn(),
    io: {
      on: vi.fn()
    }
  };

  return {
    io: vi.fn(() => mockSocket),
    getMockSocket: () => mockSocket  // Expose for tests
  };
});

describe('KanbanBoard Integration Tests - Comprehensive', () => {
  let mockSocket;
  let user;

  beforeEach(() => {
    // Get mockSocket from the mocked module
    mockSocket = require('socket.io-client').getMockSocket();

    // Reset all mock functions and state on the socket
    mockSocket.connected = false;
    mockSocket.on.mockClear();
    mockSocket.emit.mockClear();
    mockSocket.off.mockClear();
    mockSocket.disconnect.mockClear();
    mockSocket.onAny.mockClear();
    mockSocket.offAny.mockClear();
    mockSocket.io.on.mockClear();

    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  const simulateConnection = () => {
    const connectHandler = mockSocket.on.mock.calls.find(
      call => call[0] === 'connect'
    )?.[1];

    if (connectHandler) {
      mockSocket.connected = true;
      connectHandler();
    }
  };

  const simulateMessage = (eventName, data) => {
    const onAnyHandler = mockSocket.onAny.mock.calls[0]?.[0];
    if (onAnyHandler) {
      onAnyHandler(eventName, data);
    }
  };

  describe('Initial Rendering and Connection', () => {
    it('should render loading state initially', () => {
      render(<KanbanBoard />);
      expect(screen.getByText('Connecting to server...')).toBeInTheDocument();
    });

    it('should establish WebSocket connection', async () => {
      const { io } = require('socket.io-client');
      render(<KanbanBoard />);

      await waitFor(() => {
        expect(io).toHaveBeenCalledWith(
          'http://localhost:4000',
          expect.objectContaining({
            transports: ['websocket', 'polling']
          })
        );
      });
    });

    it('should display board after successful connection', async () => {
      render(<KanbanBoard />);

      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
        expect(screen.getByText(/To Do/i)).toBeInTheDocument();
        expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
        expect(screen.getByText(/Done/i)).toBeInTheDocument();
      });
    });
  });

  describe('Task Management', () => {
    beforeEach(async () => {
      render(<KanbanBoard />);
      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
      });
    });

    it('should receive and display initial tasks', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Test Task 1',
          description: 'Description 1',
          status: 'todo',
          priority: 'High',
          category: 'Bug'
        },
        {
          id: '2',
          title: 'Test Task 2',
          description: 'Description 2',
          status: 'in-progress',
          priority: 'Medium',
          category: 'Feature'
        }
      ];

      simulateMessage('tasks:all', mockTasks);

      await waitFor(() => {
        expect(screen.getByText('Test Task 1')).toBeInTheDocument();
        expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      });
    });

    it('should create new task and emit event', async () => {
      const newTaskBtn = screen.getByRole('button', { name: /new task/i });
      await user.click(newTaskBtn);

      const titleInput = screen.getByLabelText(/task title/i);
      const descriptionInput = screen.getByLabelText(/description/i);

      await user.type(titleInput, 'New Integration Test Task');
      await user.type(descriptionInput, 'Integration test description');

      const submitBtn = screen.getByRole('button', { name: /create task/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          'task:create',
          expect.objectContaining({
            title: 'New Integration Test Task',
            description: 'Integration test description'
          })
        );
      });
    });

    it('should display newly created task from WebSocket event', async () => {
      const newTask = {
        id: '3',
        title: 'Task from WebSocket',
        description: 'Created by another user',
        status: 'todo',
        priority: 'Low',
        category: 'Enhancement'
      };

      simulateMessage('task:created', newTask);

      await waitFor(() => {
        expect(screen.getByText('Task from WebSocket')).toBeInTheDocument();
        expect(screen.getByText('Created by another user')).toBeInTheDocument();
      });
    });

    it('should update task and emit event', async () => {
      const existingTask = {
        id: '1',
        title: 'Task to Update',
        description: 'Original description',
        status: 'todo',
        priority: 'Medium',
        category: 'Feature'
      };

      simulateMessage('tasks:all', [existingTask]);

      await waitFor(() => {
        expect(screen.getByText('Task to Update')).toBeInTheDocument();
      });

      const editBtn = screen.getByRole('button', { name: /edit/i });
      await user.click(editBtn);

      const titleInput = screen.getByLabelText(/task title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task Title');

      const submitBtn = screen.getByRole('button', { name: /update task/i });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          'task:update',
          expect.objectContaining({
            id: '1',
            title: 'Updated Task Title'
          })
        );
      });
    });

    it('should reflect task updates from WebSocket', async () => {
      simulateMessage('tasks:all', [{
        id: '1',
        title: 'Original Title',
        status: 'todo',
        priority: 'High',
        category: 'Bug'
      }]);

      await waitFor(() => {
        expect(screen.getByText('Original Title')).toBeInTheDocument();
      });

      simulateMessage('task:updated', {
        id: '1',
        title: 'Updated by Another User',
        status: 'todo',
        priority: 'High',
        category: 'Bug'
      });

      await waitFor(() => {
        expect(screen.getByText('Updated by Another User')).toBeInTheDocument();
        expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
      });
    });

    it('should delete task and emit event', async () => {
      simulateMessage('tasks:all', [{
        id: '1',
        title: 'Task to Delete',
        status: 'todo',
        priority: 'Low',
        category: 'Feature'
      }]);

      await waitFor(() => {
        expect(screen.getByText('Task to Delete')).toBeInTheDocument();
      });

      window.confirm = vi.fn(() => true);

      const deleteBtn = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteBtn);

      await waitFor(() => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          'task:delete',
          expect.objectContaining({
            id: '1'
          })
        );
      });
    });

    it('should remove deleted task from UI via WebSocket', async () => {
      simulateMessage('tasks:all', [
        { id: '1', title: 'Task 1', status: 'todo', priority: 'High', category: 'Bug' },
        { id: '2', title: 'Task 2', status: 'todo', priority: 'Low', category: 'Feature' }
      ]);

      await waitFor(() => {
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
      });

      simulateMessage('task:deleted', { id: '1' });

      await waitFor(() => {
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering and Search', () => {
    beforeEach(async () => {
      render(<KanbanBoard />);
      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
      });

      const tasks = [
        { id: '1', title: 'High Priority Bug', status: 'todo', priority: 'High', category: 'Bug' },
        { id: '2', title: 'Low Priority Feature', status: 'todo', priority: 'Low', category: 'Feature' },
        { id: '3', title: 'Medium Priority Enhancement', status: 'in-progress', priority: 'Medium', category: 'Enhancement' }
      ];

      simulateMessage('tasks:all', tasks);

      await waitFor(() => {
        expect(screen.getByText('High Priority Bug')).toBeInTheDocument();
      });
    });

    it('should filter tasks by priority', async () => {
      const priorityFilter = screen.getByLabelText(/priority/i);
      await user.selectOptions(priorityFilter, 'High');

      await waitFor(() => {
        expect(screen.getByText('High Priority Bug')).toBeInTheDocument();
        expect(screen.queryByText('Low Priority Feature')).not.toBeInTheDocument();
      });
    });

    it('should filter tasks by category', async () => {
      const categoryFilter = screen.getByLabelText(/category/i);
      await user.selectOptions(categoryFilter, 'Bug');

      await waitFor(() => {
        expect(screen.getByText('High Priority Bug')).toBeInTheDocument();
        expect(screen.queryByText('Low Priority Feature')).not.toBeInTheDocument();
      });
    });

    it('should search tasks by title', async () => {
      const searchInput = screen.getByPlaceholderText(/search tasks/i);
      await user.type(searchInput, 'Enhancement');

      await waitFor(() => {
        expect(screen.getByText('Medium Priority Enhancement')).toBeInTheDocument();
        expect(screen.queryByText('High Priority Bug')).not.toBeInTheDocument();
      });
    });

    it('should combine multiple filters', async () => {
      const priorityFilter = screen.getByLabelText(/priority/i);
      await user.selectOptions(priorityFilter, 'High');

      const categoryFilter = screen.getByLabelText(/category/i);
      await user.selectOptions(categoryFilter, 'Bug');

      await waitFor(() => {
        expect(screen.getByText('High Priority Bug')).toBeInTheDocument();
        expect(screen.queryByText('Low Priority Feature')).not.toBeInTheDocument();
        expect(screen.queryByText('Medium Priority Enhancement')).not.toBeInTheDocument();
      });
    });
  });

  describe('Real-time Collaboration', () => {
    beforeEach(async () => {
      render(<KanbanBoard />);
      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
      });
    });

    it('should show multiple users tasks simultaneously', async () => {
      const user1Task = {
        id: '1',
        title: 'User 1 Task',
        status: 'todo',
        priority: 'High',
        category: 'Feature',
        assignee: 'User 1'
      };

      const user2Task = {
        id: '2',
        title: 'User 2 Task',
        status: 'in-progress',
        priority: 'Medium',
        category: 'Bug',
        assignee: 'User 2'
      };

      simulateMessage('task:created', user1Task);
      simulateMessage('task:created', user2Task);

      await waitFor(() => {
        expect(screen.getByText('User 1 Task')).toBeInTheDocument();
        expect(screen.getByText('User 2 Task')).toBeInTheDocument();
      });
    });

    it('should handle rapid task updates', async () => {
      const rapidUpdates = [
        { id: '1', title: 'Update 1', status: 'todo', priority: 'High', category: 'Bug' },
        { id: '1', title: 'Update 2', status: 'todo', priority: 'High', category: 'Bug' },
        { id: '1', title: 'Update 3', status: 'todo', priority: 'High', category: 'Bug' }
      ];

      for (const update of rapidUpdates) {
        simulateMessage('task:updated', update);
      }

      await waitFor(() => {
        expect(screen.getByText('Update 3')).toBeInTheDocument();
        expect(screen.queryByText('Update 1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle WebSocket disconnection gracefully', async () => {
      render(<KanbanBoard />);
      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
      });

      const disconnectHandler = mockSocket.on.mock.calls.find(
        call => call[0] === 'disconnect'
      )?.[1];

      if (disconnectHandler) {
        mockSocket.connected = false;
        disconnectHandler('transport close');
      }

      await waitFor(() => {
        expect(screen.getByText('Connecting to server...')).toBeInTheDocument();
      });
    });

    it('should handle invalid task data', async () => {
      render(<KanbanBoard />);
      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
      });

      const invalidTask = {
        id: '1'
      };

      expect(() => {
        simulateMessage('task:created', invalidTask);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle large number of tasks efficiently', async () => {
      render(<KanbanBoard />);
      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
      });

      const largeBatch = Array.from({ length: 100 }, (_, i) => ({
        id: `task-${i}`,
        title: `Task ${i}`,
        description: `Description ${i}`,
        status: ['todo', 'in-progress', 'done'][i % 3],
        priority: ['High', 'Medium', 'Low'][i % 3],
        category: ['Bug', 'Feature', 'Enhancement'][i % 3]
      }));

      const startTime = performance.now();
      simulateMessage('tasks:all', largeBatch);
      const endTime = performance.now();

      await waitFor(() => {
        expect(screen.getByText('Task 0')).toBeInTheDocument();
      });

      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      render(<KanbanBoard />);
      simulateConnection();

      await waitFor(() => {
        expect(screen.queryByText('Connecting to server...')).not.toBeInTheDocument();
      });
    });

    it('should have proper ARIA labels', () => {
      const newTaskBtn = screen.getByRole('button', { name: /new task/i });
      expect(newTaskBtn).toHaveAccessibleName();
    });

    it('should support keyboard navigation', async () => {
      const newTaskBtn = screen.getByRole('button', { name: /new task/i });

      await user.tab();
      expect(newTaskBtn).toHaveFocus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should announce screen reader updates', async () => {
      simulateMessage('task:created', {
        id: '1',
        title: 'New Task for SR',
        status: 'todo',
        priority: 'High',
        category: 'Bug'
      });

      await waitFor(() => {
        const task = screen.getByText('New Task for SR');
        expect(task).toBeInTheDocument();

        const taskCard = task.closest('[role="listitem"]') || task.closest('.task-card');
        expect(taskCard).toBeInTheDocument();
      });
    });
  });
});
