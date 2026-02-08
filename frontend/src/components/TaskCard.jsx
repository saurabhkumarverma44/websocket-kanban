import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, Paperclip } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <div className="task-actions">
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`task-badge priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        <span className="category-badge">{task.category}</span>
      </div>

      {task.attachments && task.attachments.length > 0 && (
        <div className="task-attachments">
          <div className="attachments-list">
            {task.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                className="attachment-item"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Paperclip size={14} />
                <span>{attachment.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;

