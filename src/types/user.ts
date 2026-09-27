// ─── Usuário / Autenticação ───────────────────────────────────────────────────

export type AuthProvider = 'password' | 'google' | 'apple';

export type UserRole = 'owner' | 'dealer' | 'partner';

export type User = {
  uid: string;
  name: string;
  email: string | null;
  phone: string | null;
  provider: AuthProvider;
  role: UserRole;
  photoURL?: string | null;
  createdAt: number;
};
