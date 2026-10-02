import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { FormEvent, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import * as authApi from '../features/auth/api/authApi';
import { AuthLayout } from '../features/auth/components/AuthLayout';
import { ApiError } from '../services/apiClient';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tokenFromUrl) {
      setError('Reset link is invalid or missing. Request a new one.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await authApi.resetPassword({ token: tokenFromUrl, password });
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Enter a strong password for your account"
      footer={
        <Link component={RouterLink} to="/login" underline="hover">
          Back to sign in
        </Link>
      }
    >
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {message ? <Alert severity="success">{message}</Alert> : null}
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          fullWidth
          helperText="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={Boolean(message)}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting || Boolean(message) || !tokenFromUrl}
        >
          {submitting ? 'Updating…' : 'Update password'}
        </Button>
      </Stack>
    </AuthLayout>
  );
}
