import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (onMessage, options = {}) => {
  const {
    url = 'http://localhost:4000',
    autoConnect = true,
    reconnectionAttempts = 10,
    reconnectionDelay = 1000,
    reconnectionDelayMax = 5000
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [latency, setLatency] = useState(null);
  const [connectionQuality, setConnectionQuality] = useState('unknown');
  const [queuedMessages, setQueuedMessages] = useState(0);

  const socketRef = useRef(null);
  const messageQueueRef = useRef([]);
  const pingIntervalRef = useRef(null);

  const calculateQuality = useCallback((latencyMs) => {
    if (latencyMs < 50) return 'excellent';
    if (latencyMs < 150) return 'good';
    if (latencyMs < 300) return 'fair';
    return 'poor';
  }, []);

  const measureLatency = useCallback(() => {
    if (socketRef.current?.connected) {
      const startTime = Date.now();
      socketRef.current.emit('ping', () => {
        const latencyMs = Date.now() - startTime;
        setLatency(latencyMs);
        setConnectionQuality(calculateQuality(latencyMs));
      });
    }
  }, [calculateQuality]);

  const processMessageQueue = useCallback(() => {
    if (socketRef.current?.connected && messageQueueRef.current.length > 0) {
      const queue = [...messageQueueRef.current];
      messageQueueRef.current = [];
      
      queue.forEach(({ event, data }) => {
        socketRef.current.emit(event, data);
      });
      
      setQueuedMessages(0);
      setLastError(null);
    }
  }, []);

  useEffect(() => {
    if (!autoConnect) return;

    const socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts,
      reconnectionDelay,
      reconnectionDelayMax,
      timeout: 10000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setLastError(null);
      setReconnectAttempts(0);
      
      measureLatency();
      pingIntervalRef.current = setInterval(measureLatency, 5000);
      
      processMessageQueue();
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      setLastError(`Disconnected: ${reason}`);
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    });

    socket.on('connect_error', (error) => {
      setLastError(error.message);
      setReconnectAttempts(prev => prev + 1);
    });

    socket.io.on('reconnect_attempt', (attempt) => {
      setReconnectAttempts(attempt);
    });

    socket.io.on('reconnect', (attempt) => {
      setReconnectAttempts(0);
      setLastError(null);
    });

    socket.onAny((eventName, data) => {
      try {
        onMessage(eventName, data);
      } catch (error) {
        console.error('Message handler error:', error);
        setLastError(`Message handler error: ${error.message}`);
      }
    });

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      socket.offAny();
      socket.disconnect();
    };
  }, [url, autoConnect, reconnectionAttempts, reconnectionDelay, reconnectionDelayMax, onMessage, measureLatency, processMessageQueue]);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
      return true;
    } else {
      messageQueueRef.current.push({ event, data });
      setQueuedMessages(messageQueueRef.current.length);
      setLastError(`Message queued - disconnected (${messageQueueRef.current.length} queued)`);
      return false;
    }
  }, []);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setTimeout(() => {
        socketRef.current?.connect();
      }, 500);
    }
  }, []);

  return {
    isConnected,
    lastError,
    reconnectAttempts,
    latency,
    connectionQuality,
    queuedMessages,
    emit,
    reconnect
  };
};

export default useWebSocket;