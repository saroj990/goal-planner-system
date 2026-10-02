import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import * as authApi from '../features/auth/api/authApi';
import { useAuth } from '../features/auth/hooks/useAuth';
import { cardSurfaceSx } from '../app/theme';
import { ApiError } from '../services/apiClient';

export function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const updated = await authApi.updateProfile({ name });
      setUser(updated);
      setSuccess('Profile updated');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">Profile</Typography>

      <Card elevation={0} sx={(theme) => ({ ...cardSurfaceSx(theme), maxWidth: 480 })}>
        <CardContent>
          <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {success ? <Alert severity="success">{success}</Alert> : null}
            <TextField label="Email" value={user.email} disabled fullWidth />
            <TextField
              label="Display name"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Button variant="outlined" color="inherit" onClick={logout} sx={{ alignSelf: 'flex-start' }}>
        Sign out
      </Button>
    </Stack>
  );
}
