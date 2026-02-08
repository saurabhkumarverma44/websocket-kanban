import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useWebSocket from '../../hooks/useWebSocket';

// ✅ FIXED: Declare mockSocket OUTSIDE the vi.mock() call
let mockSocket;

vi.mock('socket.io-client', () => {
  // ✅ FIXED: Assign to the outer variable, not a const inside
  mockSocket = {
    id: 'mock-socket-id',
    connected: false,
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn((event, data, callback) => {
      if (event === 'ping' && callback) {
        callback();
      }
    }),
    disconnect: vi.fn(),
    connect: vi.fn(),
    onAny: vi.fn(),
    offAny: vi.fn(),
    io: {
      on: vi.fn()
    }
  };

  // ✅ FIXED: Remove __mockSocket from return
  return {
    io: vi.fn(() => mockSocket)
  };
});

describe('useWebSocket Hook - Comprehensive Tests', () => {
  let onMessageHandler;

  // ✅ FIXED: Reset mock properties instead of using require()
  beforeEach(() => {
    // Reset mock socket properties
    mockSocket.connected = false;
    mockSocket.on.mockClear();
    mockSocket.off.mockClear();
    mockSocket.emit.mockClear();
    mockSocket.disconnect.mockClear();
    mockSocket.connect.mockClear();
    mockSocket.onAny.mockClear();
    mockSocket.offAny.mockClear();
    mockSocket.io.on.mockClear();
    
    onMessageHandler = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Connection Management', () => {
    it('should initialize WebSocket connection with correct config', () => {
      const { io } = require('socket.io-client');
      
      renderHook(() => useWebSocket(onMessageHandler, {
        url: 'http://test-server:4000',
        reconnectionAttempts: 5
      }));

      expect(io).toHaveBeenCalledWith(
        'http://test-server:4000',
        expect.objectContaining({
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5
        })
      );
    });

    it('should handle successful connection', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      expect(result.current.isConnected).toBe(false);

      act(() => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        mockSocket.connected = true;
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      expect(result.current.lastError).toBeNull();
      expect(result.current.reconnectAttempts).toBe(0);
    });

    it('should handle disconnection', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        mockSocket.connected = true;
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      act(() => {
        const disconnectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'disconnect'
        )[1];
        mockSocket.connected = false;
        disconnectHandler('transport close');
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
        expect(result.current.lastError).toContain('Disconnected');
      });
    });

    it('should handle connection errors', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const errorHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect_error'
        )[1];
        errorHandler(new Error('Connection timeout'));
      });

      await waitFor(() => {
        expect(result.current.lastError).toBe('Connection timeout');
        expect(result.current.reconnectAttempts).toBeGreaterThan(0);
      });
    });
  });

  describe('Message Handling', () => {
    it('should receive and handle messages', async () => {
      renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const onAnyHandler = mockSocket.onAny.mock.calls[0][0];
        onAnyHandler('task:created', { id: '1', title: 'Test Task' });
      });

      await waitFor(() => {
        expect(onMessageHandler).toHaveBeenCalledWith(
          'task:created',
          { id: '1', title: 'Test Task' }
        );
      });
    });

    it('should emit messages when connected', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        mockSocket.connected = true;
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      act(() => {
        const success = result.current.emit('task:create', { title: 'New Task' });
        expect(success).toBe(true);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'task:create',
        { title: 'New Task' }
      );
    });

    it('should queue messages when disconnected', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const success = result.current.emit('task:create', { title: 'Queued Task' });
        expect(success).toBe(false);
      });

      expect(result.current.queuedMessages).toBe(1);
      expect(result.current.lastError).toContain('queued');
    });

    it('should process queued messages after reconnection', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        result.current.emit('task:create', { title: 'Queued Task' });
      });

      expect(result.current.queuedMessages).toBe(1);

      act(() => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        mockSocket.connected = true;
        connectHandler();
      });

      await waitFor(() => {
        expect(mockSocket.emit).toHaveBeenCalledWith(
          'task:create',
          { title: 'Queued Task' }
        );
      });
    });
  });

  describe('Latency Monitoring', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should measure latency periodically', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        mockSocket.connected = true;
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'ping',
        expect.any(Function)
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockSocket.emit).toHaveBeenCalledTimes(2);
    });

    it('should calculate connection quality based on latency', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        mockSocket.connected = true;
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.latency).toBeDefined();
        expect(result.current.connectionQuality).not.toBe('unknown');
      });
    });
  });

  describe('Reconnection Logic', () => {
    it('should track reconnection attempts', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const reconnectAttemptHandler = mockSocket.io.on.mock.calls.find(
          call => call[0] === 'reconnect_attempt'
        )[1];
        reconnectAttemptHandler(1);
      });

      await waitFor(() => {
        expect(result.current.reconnectAttempts).toBe(1);
      });

      act(() => {
        const reconnectAttemptHandler = mockSocket.io.on.mock.calls.find(
          call => call[0] === 'reconnect_attempt'
        )[1];
        reconnectAttemptHandler(2);
      });

      await waitFor(() => {
        expect(result.current.reconnectAttempts).toBe(2);
      });
    });

    it('should reset reconnection counter on successful reconnect', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const reconnectAttemptHandler = mockSocket.io.on.mock.calls.find(
          call => call[0] === 'reconnect_attempt'
        )[1];
        reconnectAttemptHandler(3);
      });

      await waitFor(() => {
        expect(result.current.reconnectAttempts).toBe(3);
      });

      act(() => {
        const reconnectHandler = mockSocket.io.on.mock.calls.find(
          call => call[0] === 'reconnect'
        )[1];
        reconnectHandler(3);
      });

      await waitFor(() => {
        expect(result.current.reconnectAttempts).toBe(0);
        expect(result.current.lastError).toBeNull();
      });
    });

    it('should handle manual reconnect', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        result.current.reconnect();
      });

      expect(mockSocket.disconnect).toHaveBeenCalled();
      
      await waitFor(() => {
        expect(mockSocket.connect).toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe('Cleanup and Resource Management', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useWebSocket(onMessageHandler));

      unmount();

      expect(mockSocket.offAny).toHaveBeenCalled();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should clear intervals on disconnect', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const connectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect'
        )[1];
        mockSocket.connected = true;
        connectHandler();
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true);
      });

      act(() => {
        const disconnectHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'disconnect'
        )[1];
        mockSocket.connected = false;
        disconnectHandler('transport close');
      });

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false);
      });

      const emitCallsBefore = mockSocket.emit.mock.calls.length;
      
      vi.advanceTimersByTime(10000);
      
      const emitCallsAfter = mockSocket.emit.mock.calls.length;
      expect(emitCallsAfter).toBe(emitCallsBefore);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in message handler gracefully', async () => {
      const faultyHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      
      const { result } = renderHook(() => useWebSocket(faultyHandler));

      act(() => {
        const onAnyHandler = mockSocket.onAny.mock.calls[0][0];
        onAnyHandler('task:created', { id: '1' });
      });

      await waitFor(() => {
        expect(result.current.lastError).toContain('Message handler error');
      });
    });

    it('should provide detailed error messages', async () => {
      const { result } = renderHook(() => useWebSocket(onMessageHandler));

      act(() => {
        const errorHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'connect_error'
        )[1];
        errorHandler(new Error('ECONNREFUSED'));
      });

      await waitFor(() => {
        expect(result.current.lastError).toBe('ECONNREFUSED');
      });
    });
  });

  describe('Configuration Options', () => {
    it('should respect autoConnect option', () => {
      const { io } = require('socket.io-client');
      
      renderHook(() => useWebSocket(onMessageHandler, {
        autoConnect: false
      }));

      expect(io).not.toHaveBeenCalled();
    });

    it('should use custom reconnection settings', () => {
      const { io } = require('socket.io-client');
      
      renderHook(() => useWebSocket(onMessageHandler, {
        reconnectionAttempts: 3,
        reconnectionDelay: 500,
        reconnectionDelayMax: 2000
      }));

      expect(io).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          reconnectionAttempts: 3,
          reconnectionDelay: 500,
          reconnectionDelayMax: 2000
        })
      );
    });
  });
});