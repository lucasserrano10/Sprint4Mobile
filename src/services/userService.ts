import { ref, set, get } from 'firebase/database';
import { database } from './firebase';
import { User } from '../types/user';

export async function saveUser(user: User): Promise<void> {
  const userRef = ref(database, `users/${user.uid}`);
  await set(userRef, {
    name: user.name,
    email: user.email,
    phone: user.phone,
    provider: user.provider,
    role: user.role,
    createdAt: user.createdAt,
  });
}

export async function getUserById(uid: string): Promise<User | null> {
  const userRef = ref(database, `users/${uid}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.val();
  return {
    uid,
    name: data.name,
    email: data.email ?? null,
    phone: data.phone ?? null,
    provider: data.provider,
    role: data.role ?? 'owner',
    createdAt: data.createdAt ?? Date.now(),
  };
}

export async function updateUserPhone(uid: string, phone: string): Promise<void> {
  const userRef = ref(database, `users/${uid}/phone`);
  await set(userRef, phone);
}
