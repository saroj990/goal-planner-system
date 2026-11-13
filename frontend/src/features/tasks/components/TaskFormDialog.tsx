import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState, type ReactNode } from 'react';
import { radius } from '../../../app/theme';
import { useAuth } from '../../auth/hooks/useAuth';
import { useAssignableUsers } from '../../users/hooks/useAssignableUsers';
import { TaskPriority, type CreateTaskInput, type Task } from '../types';
import { TaskAssigneeField } from './TaskAssigneeField';
import { TaskPriorityPicker } from './TaskPriorityPicker';

interface TaskFormDialogProps {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  extraFields?: ReactNode;
}

export function TaskFormDialog({ open, initial, onClose, onSubmit, extraFields }: TaskFormDialogProps) {
  const { user } = useAuth();
  const { data: assignableUsers, isLoading: usersLoading } = useAssignableUsers();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setDescription(initial?.description ?? '');
      setDueDate(initial?.dueDate?.slice(0, 10) ?? '');
      setPriority(initial?.priority ?? TaskPriority.MEDIUM);
      const defaultAssignee =
        initial?.assigneeId ??
        (user?.role === 'ADMIN' ? (assignableUsers?.[0]?.id ?? '') : (user?.id ?? ''));
      setAssigneeId(defaultAssignee);
    }
  }, [open, initial, user?.id, user?.role, assignableUsers]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
        assigneeId: assigneeId ? assigneeId : null,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="body">
      <DialogTitle sx={{ pb: 1 }}>
        <Typography component="span" variant="h6" fontWeight={700}>
          {initial ? 'Edit task' : 'New task'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {initial ? 'Update details, priority, and ownership.' : 'Capture what needs doing and who owns it.'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={2.5}>
          {extraFields}
          <TextField
            label="Title"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Notes"
            placeholder="Context, links, or acceptance criteria"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <Divider />

          <Box
            sx={{
              p: 2,
              borderRadius: `${radius.control}px`,
              bgcolor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2.5}>
              <TaskPriorityPicker value={priority} onChange={setPriority} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <TaskAssigneeField
                    users={assignableUsers ?? []}
                    valueId={assigneeId}
                    onChange={setAssigneeId}
                    loading={usersLoading}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={600}
                    letterSpacing="0.02em"
                    display="block"
                    sx={{ mb: 1 }}
                  >
                    Due date
                  </Typography>
                  <TextField
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    size="small"
                  />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting || !title.trim()}>
          {initial ? 'Save changes' : 'Create task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
