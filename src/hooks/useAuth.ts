import { useState, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  loginWithApple,
  parseAuthError,
} from '../services/authService';

type UseAuthReturn = {
  loading: boolean;
  error: string | null;
  handleRegister: (name: string, email: string, password: string) => Promise<void>;
  handleLoginEmail: (email: string, password: string) => Promise<void>;
  handleLoginGoogle: () => Promise<void>;
  handleLoginApple: () => Promise<void>;
  clearError: () => void;
};

export function useAuth(): UseAuthReturn {
  const { setUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleRegister = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const user = await registerWithEmail(name, email, password);
        setUser(user);
      } catch (err) {
        setError(parseAuthError(err));
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  const handleLoginEmail = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const user = await loginWithEmail(email, password);
        setUser(user);
      } catch (err) {
        setError(parseAuthError(err));
      } finally {
        setLoading(false);
      }
    },
    [setUser]
  );

  const handleLoginGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      setUser(user);
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const handleLoginApple = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithApple();
      setUser(user);
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  return {
    loading,
    error,
    handleRegister,
    handleLoginEmail,
    handleLoginGoogle,
    handleLoginApple,
    clearError,
  };
}
