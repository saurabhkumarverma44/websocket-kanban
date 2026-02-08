import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TaskChart = ({ tasks }) => {
  const data = [
    {
      name: 'To Do',
      count: tasks.filter((t) => t.status === 'todo').length,
    },
    {
      name: 'In Progress',
      count: tasks.filter((t) => t.status === 'in-progress').length,
    },
    {
      name: 'Done',
      count: tasks.filter((t) => t.status === 'done').length,
    },
  ];

  return (
    <div className="chart-container">
      <h2>📊 Task Distribution</h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3498db" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TaskChart;

