import React, { useState, useCallback } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import useWebSocket from '../hooks/useWebSocket';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeId, setActiveId] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const handleMessage = useCallback((eventName, ...args) => {
    const data = args[0];

    switch (eventName) {
      case 'tasks:all':
        setTasks(data);
        break;
      case 'task:created':
        setTasks((prev) => [...prev, data]);
        break;
      case 'task:updated':
        setTasks((prev) =>
          prev.map((task) => (task.id === data.id ? data : task))
        );
        break;
      case 'task:deleted':
        setTasks((prev) => prev.filter((task) => task.id !== data.id));
        break;
      default:
        break;
    }
  }, []);

  const { isConnected, emit } = useWebSocket(handleMessage);

  const handleSubmitTask = (taskData) => {
    if (editingTask) {
      emit('task:update', { ...editingTask, ...taskData });
    } else {
      emit('task:create', taskData);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      emit('task:delete', { id: taskId });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id;
      const newStatus = over.id;

      emit('task:move', { id: taskId, newStatus });
    }

    setActiveId(null);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Filter tasks
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => {
      const matchesStatus = task.status === status;
      const matchesSearch = !searchTerm || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

      return matchesStatus && matchesSearch && matchesPriority && matchesCategory;
    });
  };

  const columns = [
    { id: 'todo', title: '📝 To Do', tasks: getTasksByStatus('todo') },
    { id: 'in-progress', title: '🔄 In Progress', tasks: getTasksByStatus('in-progress') },
    { id: 'done', title: '✅ Done', tasks: getTasksByStatus('done') },
  ];

  // Export functionality
  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kanban-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (!isConnected) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '20px', fontSize: '16px' }}>Connecting to server...</p>
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"/>
          </svg>
          Kanban Pro
        </div>
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="navbar-actions">
          <button className="btn-icon" onClick={handleExport}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
          </button>
        </div>
      </nav>

      <div className="kanban-container">
        {/* Board Header */}
        <div className="kanban-header">
          <h1>📋 Project Board</h1>
          <div className="header-actions">
            <button className="new-task-btn" onClick={() => setShowForm(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Task
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <span className="filter-label">Priority:</span>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="filter-label">Category:</span>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="Bug">Bug</option>
              <option value="Feature">Feature</option>
              <option value="Enhancement">Enhancement</option>
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="kanban-board">
            {columns.map((column) => (
              <SortableContext
                key={column.id}
                items={column.tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <Column
                  id={column.id}
                  title={column.title}
                  tasks={column.tasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              </SortableContext>
            ))}
          </div>

          <DragOverlay>
            {activeId ? (
              <TaskCard task={tasks.find((t) => t.id === activeId)} />
            ) : null}
          </DragOverlay>
        </DndContext>

        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={handleSubmitTask}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default KanbanBoard;
