import { Alert, Avatar, Button, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import * as authApi from '../features/auth/api/authApi';
import { useAuth } from '../features/auth/hooks/useAuth';
import { initialsFromName } from '../features/users/userDisplay';
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
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Update how your name appears across tasks and comments."
      />

      <SectionCard>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            {initialsFromName(user.name)}
          </Avatar>
          <Stack spacing={0.25}>
            <Typography fontWeight={700}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Stack>
        </Stack>

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
      </SectionCard>

      <Button variant="outlined" color="inherit" onClick={logout} sx={{ alignSelf: 'flex-start' }}>
        Sign out
      </Button>
    </Stack>
  );
}
