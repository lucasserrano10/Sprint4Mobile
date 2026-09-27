import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getUserById } from '../services/userService';
import { logout as firebaseLogout } from '../services/authService';
import { User } from '../types/user';

type AuthContextData = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser = await getUserById(firebaseUser.uid);
        setUser(appUser);
      } else {
        // Não limpa o usuário se for uma conta demo (sem Firebase real)
        setUser(prev => {
          if (prev?.uid === 'demo-uid-fordnexus') return prev;
          return null;
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseLogout();
    } catch {
      // Ignora erro de logout para contas demo sem Firebase configurado
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextData {
  return useContext(AuthContext);
}
