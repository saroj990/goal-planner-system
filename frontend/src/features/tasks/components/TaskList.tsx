import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Box,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { TASK_STATUS_LABEL } from '../taskStatusStyle';
import { TaskStatusChip } from './TaskStatusChip';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          textAlign: 'center',
          borderStyle: 'dashed',
          bgcolor: 'background.paper',
        }}
      >
        <Typography fontWeight={600} gutterBottom>No tasks yet</Typography>
        <Typography variant="body2" color="text.secondary">
          Add tasks here or on the shared board.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={1.5}>
      {tasks.map((task) => (
        <Paper
          key={task.id}
          elevation={0}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography fontWeight={600}>{task.title}</Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            )}
          </Box>

          <Select
            size="small"
            value={task.status}
            onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
            renderValue={(value) => <TaskStatusChip status={value as TaskStatus} />}
            sx={{
              minWidth: 140,
              '& .MuiSelect-select': { py: 0.5, display: 'flex', alignItems: 'center' },
            }}
          >
            {Object.values(TaskStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {TASK_STATUS_LABEL[status]}
              </MenuItem>
            ))}
          </Select>

          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" aria-label="Edit task" onClick={() => onEdit(task)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="Delete task"
              color="error"
              onClick={() => onDelete(task)}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
