import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { EmptyState } from '../../../components/EmptyState';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { TaskAssigneeChip } from './TaskAssigneeChip';
import { TaskCommentsPanel } from './TaskCommentsPanel';
import { TaskPriorityChip } from './TaskPriorityChip';
import { TaskStatusPicker } from './TaskStatusPicker';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  canManage?: boolean;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  canManage = true,
}: TaskListProps) {
  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<AddTaskOutlinedIcon />}
        title="No tasks yet"
        description="Add tasks here or drag work across statuses on the shared board."
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {tasks.map((task) => (
        <Paper
          key={task.id}
          elevation={0}
          sx={{
            p: 2.25,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            flexWrap: 'wrap',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
            '&:hover': {
              borderColor: 'primary.light',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? '0 8px 20px rgba(0,0,0,0.28)'
                  : '0 8px 20px rgba(15, 23, 42, 0.06)',
            },
          }}
        >
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography fontWeight={600} sx={{ lineHeight: 1.35 }}>
              {task.title}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              <TaskPriorityChip priority={task.priority} />
              <TaskAssigneeChip assignee={task.assignee} />
            </Stack>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            )}
            <TaskCommentsPanel
              taskId={task.id}
              open={commentsOpenFor === task.id}
              onToggle={() =>
                setCommentsOpenFor((current) => (current === task.id ? null : task.id))
              }
            />
          </Box>

          <TaskStatusPicker
            value={task.status}
            onChange={(status) => onStatusChange(task, status)}
          />

          {canManage ? (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit">
                <IconButton size="small" aria-label="Edit task" onClick={() => onEdit(task)}>
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  aria-label="Delete task"
                  color="error"
                  onClick={() => onDelete(task)}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : null}
        </Paper>
      ))}
    </Stack>
  );
}
