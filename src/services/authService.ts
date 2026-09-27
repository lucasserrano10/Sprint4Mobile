import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { auth } from './firebase';
import { saveUser } from './userService';
import { User } from '../types/user';

export function configureGoogleSignIn(): void {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });

  const user: User = {
    uid: credential.user.uid,
    name,
    email: credential.user.email,
    phone: null,
    provider: 'password',
    role: 'owner',
    createdAt: Date.now(),
  };

  await saveUser(user);
  return user;
}

const DEMO_USER: User = {
  uid: 'demo-uid-fordnexus',
  name: 'Lucas Serrano',
  email: 'demo@fordnexus.com',
  phone: '(11) 99999-0000',
  provider: 'password',
  role: 'owner',
  createdAt: Date.now(),
};

export async function loginWithEmail(email: string, password: string): Promise<User> {
  // Demo credentials — funciona sem Firebase configurado
  if (
    email.toLowerCase() === 'demo@fordnexus.com' &&
    password === 'Ford@2025'
  ) {
    return DEMO_USER;
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);

  const user: User = {
    uid: credential.user.uid,
    name: credential.user.displayName ?? 'Usuário',
    email: credential.user.email,
    phone: null,
    provider: 'password',
    role: 'owner',
    createdAt: Date.now(),
  };

  await saveUser(user);
  return user;
}

export async function loginWithGoogle(): Promise<User> {
  if (Platform.OS === 'web') {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);

    const user: User = {
      uid: credential.user.uid,
      name: credential.user.displayName ?? 'Usuário Google',
      email: credential.user.email,
      phone: null,
      provider: 'google',
      role: 'owner',
      createdAt: Date.now(),
    };

    await saveUser(user);
    return user;
  }

  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices();
  const signInResult = await GoogleSignin.signIn();

  const idToken = signInResult.data?.idToken;
  if (!idToken) throw new Error('Google Sign-In: token não obtido.');

  const googleCredential = GoogleAuthProvider.credential(idToken);
  const credential = await signInWithCredential(auth, googleCredential);

  const user: User = {
    uid: credential.user.uid,
    name: credential.user.displayName ?? 'Usuário Google',
    email: credential.user.email,
    phone: null,
    provider: 'google',
    role: 'owner',
    createdAt: Date.now(),
  };

  await saveUser(user);
  return user;
}

export async function loginWithApple(): Promise<User> {
  if (Platform.OS !== 'ios') throw new Error('Login com Apple disponível apenas no iOS.');

  const nonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Math.random().toString(36).substring(2)
  );

  const appleCredential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce,
  });

  const { identityToken } = appleCredential;
  if (!identityToken) throw new Error('Apple Sign-In: token não obtido.');

  const provider = new OAuthProvider('apple.com');
  const oauthCredential = provider.credential({ idToken: identityToken, rawNonce: nonce });
  const firebaseCredential = await signInWithCredential(auth, oauthCredential);

  const fullName = appleCredential.fullName;
  const name =
    fullName?.givenName && fullName?.familyName
      ? `${fullName.givenName} ${fullName.familyName}`
      : firebaseCredential.user.displayName ?? 'Usuário Apple';

  const user: User = {
    uid: firebaseCredential.user.uid,
    name,
    email: firebaseCredential.user.email ?? appleCredential.email,
    phone: null,
    provider: 'apple',
    role: 'owner',
    createdAt: Date.now(),
  };

  await saveUser(user);
  return user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function parseAuthError(err: unknown): string {
  if (err instanceof Error) {
    const code = (err as { code?: string }).code;
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso.';
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Sem conexão com a internet.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  }
  return 'Ocorreu um erro inesperado.';
}
