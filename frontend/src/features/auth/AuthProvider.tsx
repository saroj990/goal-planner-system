import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { setApiUnauthorizedHandler } from '../../services/apiClient';
import * as authApi from './api/authApi';
import { clearStoredAuth, getStoredAccessToken, getStoredUser, persistAuth } from './authStorage';
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from './types';

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function parseStoredUser(): AuthUser | null {
  const raw = getStoredUser();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function applySession(session: AuthSession): void {
  persistAuth(session.accessToken, JSON.stringify(session.user));
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUserState] = useState<AuthUser | null>(() => parseStoredUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredAccessToken());
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredAccessToken()));

  const logout = useCallback(() => {
    clearStoredAuth();
    setAccessToken(null);
    setUserState(null);
  }, []);

  useEffect(() => {
    setApiUnauthorizedHandler(logout);
    return () => setApiUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    authApi
      .fetchMe()
      .then((me) => {
        if (!cancelled) {
          setUserState(me);
          persistAuth(token, JSON.stringify(me));
        }
      })
      .catch(() => {
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [logout]);

  const login = useCallback(async (input: LoginInput) => {
    const session = await authApi.login(input);
    applySession(session);
    setAccessToken(session.accessToken);
    setUserState(session.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const session = await authApi.register(input);
    applySession(session);
    setAccessToken(session.accessToken);
    setUserState(session.user);
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await authApi.fetchMe();
    const token = getStoredAccessToken();
    if (token) persistAuth(token, JSON.stringify(me));
    setUserState(me);
  }, []);

  const setUser = useCallback((next: AuthUser) => {
    const token = getStoredAccessToken();
    if (token) persistAuth(token, JSON.stringify(next));
    setUserState(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isLoading,
      isAuthenticated: Boolean(accessToken && user),
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, accessToken, isLoading, login, register, logout, refreshUser, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
