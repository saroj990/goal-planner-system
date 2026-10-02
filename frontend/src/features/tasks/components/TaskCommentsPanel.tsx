import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTaskCommentMutations, useTaskComments } from '../hooks/useTaskComments';
import { MarkdownContent } from './MarkdownContent';

interface TaskCommentsPanelProps {
  taskId: string;
  open: boolean;
  onToggle: () => void;
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function TaskCommentsPanel({ taskId, open, onToggle }: TaskCommentsPanelProps) {
  const { user } = useAuth();
  const { data: comments, isLoading, isError, error } = useTaskComments(taskId, open);
  const { create, remove } = useTaskCommentMutations(taskId);
  const [body, setBody] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;
    await create.mutateAsync({ body: trimmed });
    setBody('');
  }

  const count = comments?.length ?? 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        size="small"
        startIcon={<ChatBubbleOutlineIcon />}
        onClick={onToggle}
        sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
      >
        {open ? 'Hide comments' : 'Comments'}
        {count > 0 ? ` (${count})` : ''}
      </Button>

      <Collapse in={open}>
        <Box
          sx={{
            mt: 1.5,
            p: 2,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={22} />
            </Box>
          )}

          {isError && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error instanceof Error ? error.message : 'Failed to load comments'}
            </Alert>
          )}

          {!isLoading && !isError && (
            <Stack spacing={2}>
              {comments?.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No comments yet. Markdown is supported.
                </Typography>
              )}

              {comments?.map((comment) => (
                <Box key={comment.id}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {comment.author.name} · {formatWhen(comment.createdAt)}
                    </Typography>
                    {user?.id === comment.author.id && (
                      <IconButton
                        size="small"
                        aria-label="Delete comment"
                        onClick={() => remove.mutate(comment.id)}
                        disabled={remove.isPending}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                  <MarkdownContent content={comment.body} />
                </Box>
              ))}

              <Stack component="form" spacing={1} onSubmit={handleSubmit}>
                <TextField
                  label="Add a comment"
                  placeholder="Write markdown… **bold**, `code`, lists"
                  multiline
                  minRows={2}
                  fullWidth
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  disabled={!body.trim() || create.isPending}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  {create.isPending ? 'Posting…' : 'Post comment'}
                </Button>
              </Stack>
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
