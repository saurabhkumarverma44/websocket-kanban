// Helper functions for task operations

export const createTask = (taskData) => {
  return {
    id: Date.now().toString(),
    title: taskData.title,
    description: taskData.description || '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'Medium',
    category: taskData.category || 'Feature',
    attachments: taskData.attachments || []
  };
};

export const updateTask = (tasks, taskId, updates) => {
  return tasks.map(task => 
    task.id === taskId ? { ...task, ...updates } : task
  );
};

export const deleteTask = (tasks, taskId) => {
  return tasks.filter(task => task.id !== taskId);
};

export const moveTask = (tasks, taskId, newStatus) => {
  return tasks.map(task =>
    task.id === taskId ? { ...task, status: newStatus } : task
  );
};

export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};

export const getTaskStats = (tasks) => {
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  return {
    todoCount,
    inProgressCount,
    doneCount,
    totalCount,
    completionRate
  };
};

export const validateTask = (task) => {
  if (!task.title || task.title.trim() === '') {
    return { valid: false, error: 'Title is required' };
  }
  if (!['todo', 'in-progress', 'done'].includes(task.status)) {
    return { valid: false, error: 'Invalid status' };
  }
  if (!['Low', 'Medium', 'High'].includes(task.priority)) {
    return { valid: false, error: 'Invalid priority' };
  }
  if (!['Bug', 'Feature', 'Enhancement'].includes(task.category)) {
    return { valid: false, error: 'Invalid category' };
  }
  return { valid: true };
};
