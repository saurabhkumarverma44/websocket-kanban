import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// In-memory task storage
let tasks = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task',
    status: 'todo',
    priority: 'Medium',
    category: 'Feature',
    attachments: []
  }
];

// WebSocket event handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send all tasks to newly connected client
  socket.emit('tasks:all', tasks);

  // Create task
  socket.on('task:create', (taskData) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'Medium',
        category: taskData.category || 'Feature',
        attachments: taskData.attachments || []
      };
      tasks.push(newTask);
      io.emit('task:created', newTask);
      console.log('Task created:', newTask.id);
    } catch (error) {
      socket.emit('error', { message: 'Failed to create task' });
      console.error('Error creating task:', error);
    }
  });

  // Update task
  socket.on('task:update', (updateData) => {
    try {
      const taskIndex = tasks.findIndex(t => t.id === updateData.id);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updateData };
        io.emit('task:updated', tasks[taskIndex]);
        console.log('Task updated:', updateData.id);
      } else {
        socket.emit('error', { message: 'Task not found' });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to update task' });
      console.error('Error updating task:', error);
    }
  });

  // Move task
  socket.on('task:move', (moveData) => {
    try {
      const task = tasks.find(t => t.id === moveData.id);
      if (task) {
        task.status = moveData.newStatus;
        io.emit('task:updated', task);
        console.log('Task moved:', moveData.id, 'to', moveData.newStatus);
      } else {
        socket.emit('error', { message: 'Task not found' });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to move task' });
      console.error('Error moving task:', error);
    }
  });

  // Delete task
  socket.on('task:delete', (deleteData) => {
    try {
      const taskIndex = tasks.findIndex(t => t.id === deleteData.id);
      if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        io.emit('task:deleted', { id: deleteData.id });
        console.log('Task deleted:', deleteData.id);
      } else {
        socket.emit('error', { message: 'Task not found' });
      }
    } catch (error) {
      socket.emit('error', { message: 'Failed to delete task' });
      console.error('Error deleting task:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
