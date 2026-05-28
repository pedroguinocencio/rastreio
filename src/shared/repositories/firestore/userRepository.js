/**
 * Firestore User Repository - rastre.io
 * CRUD no Firestore para usuários
 * Inclui criação via Firebase Auth (secondary app pattern)
 */
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, limit
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { deleteApp, initializeApp } from 'firebase/app';
import { app, db } from '../../utils/firebase';
import { generateId } from '../../utils/formatters';

const COLLECTION = 'users';

export async function getAll() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const result = [];
  snapshot.forEach((d) => result.push({ id: d.id, ...d.data() }));
  return result;
}

export async function getById(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Usuário não encontrado');
  return { id: snap.id, ...snap.data() };
}

export function getByEmail() {
  // No modo Firestore, a verificação de email é feita no create()
  // via query direta. Esse método não é necessário no fluxo atual.
  return null;
}

export async function create(data) {
  const email = data.email.trim();

  // Verifica duplicata no Firestore
  const q = query(
    collection(db, COLLECTION),
    where('email', '==', email),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    throw new Error('Email já cadastrado no sistema');
  }

  // Cria usuário no Firebase Auth via secondary app (evita deslogar o admin)
  let secondaryApp = null;
  let userId;

  try {
    secondaryApp = initializeApp(app.options, `user-create-${generateId()}`);
    const secondaryAuth = getAuth(secondaryApp);
    const credential = await createUserWithEmailAndPassword(
      secondaryAuth, email, data.password
    );
    userId = credential.user.uid;
    await signOut(secondaryAuth);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('Email já cadastrado no Firebase Auth', { cause: error });
    }
    throw error;
  } finally {
    if (secondaryApp) {
      await deleteApp(secondaryApp);
    }
  }

  const newUser = {
    id: userId,
    ...data,
    email,
    active: true,
    createdAt: new Date().toISOString()
  };
  delete newUser.password;

  const ref = doc(db, COLLECTION, userId);
  await setDoc(ref, newUser);
  return newUser;
}

export async function update(id, data) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Usuário não encontrado');

  const profileData = { ...data };
  delete profileData.password;

  await updateDoc(ref, profileData);
  return { id, ...snap.data(), ...profileData };
}

export async function toggleActive(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Usuário não encontrado');

  const currentActive = snap.data().active;
  await updateDoc(ref, { active: !currentActive });
  return { id, ...snap.data(), active: !currentActive };
}
