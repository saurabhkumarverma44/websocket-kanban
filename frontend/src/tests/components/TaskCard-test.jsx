import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../components/TaskCard';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Edit2: () => <div data-testid="edit-icon">Edit</div>,
  Trash2: () => <div data-testid="trash-icon">Trash</div>,
  Paperclip: () => <div data-testid="paperclip-icon">Paperclip</div>
}));

// Mock @dnd-kit/sortable
vi.mock('@dnd-kit/sortable', () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false
  })
}));

describe('TaskCard Component', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'High',
    category: 'Bug',
    attachments: []
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('should render task title and description', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render priority and category badges', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });

  it('should render edit and delete buttons', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTitle('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('should render attachments count when attachments exist', () => {
    const taskWithAttachments = {
      ...mockTask,
      attachments: [
        { name: 'file1.pdf', url: 'url1' },
        { name: 'file2.png', url: 'url2' }
      ]
    };

    render(
      <TaskCard
        task={taskWithAttachments}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('2 attachment(s)')).toBeInTheDocument();
    expect(screen.getByTestId('paperclip-icon')).toBeInTheDocument();
  });

  it('should not render attachments section when no attachments', () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByTestId('paperclip-icon')).not.toBeInTheDocument();
  });

  it('should not render description when empty', () => {
    const taskWithoutDescription = {
      ...mockTask,
      description: ''
    };

    render(
      <TaskCard
        task={taskWithoutDescription}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should apply dragging class when isDragging is true', () => {
    const { container } = render(
      <TaskCard
        task={mockTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isDragging={true}
      />
    );

    const taskCard = container.querySelector('.task-card');
    expect(taskCard).toHaveClass('dragging');
  });
});
