/**
 * User Service - rastre.io
 * Serviço de gerenciamento de usuários (admin)
 */
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, limit 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { deleteApp, initializeApp } from 'firebase/app';
import { app, db } from '../../../shared/utils/firebase';
import { generateId } from '../../../shared/utils/formatters';

/**
 * Retorna todos os usuários
 */
export async function getUsers(filters = {}) {
  const usersRef = collection(db, 'users');
  let q = usersRef;
  
  if (filters.role) {
    q = query(usersRef, where('role', '==', filters.role));
  }
  
  const snapshot = await getDocs(q);
  let result = [];
  snapshot.forEach(doc => {
    result.push({ id: doc.id, ...doc.data() });
  });

  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(u =>
      u.name.toLowerCase().includes(s) ||
      u.email.toLowerCase().includes(s)
    );
  }
  return result;
}

/**
 * Retorna um usuário por ID
 */
export async function getUserById(id) {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Usuário não encontrado');
  }
  return { id: docSnap.id, ...docSnap.data() };
}

/**
 * Cria novo usuário
 */
export async function createUser(data) {
  const email = data.email.trim();

  // Verifica se o e-mail já existe no perfil Firestore
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    throw new Error('Email já cadastrado no sistema');
  }

  let secondaryApp = null;
  let userId;

  try {
    secondaryApp = initializeApp(app.options, `user-create-${generateId()}`);
    const secondaryAuth = getAuth(secondaryApp);
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, data.password);
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

  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, newUser);
  return newUser;
}

/**
 * Atualiza usuário existente
 */
export async function updateUser(id, data) {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Usuário não encontrado');
  }

  const profileData = { ...data };
  delete profileData.password;

  const updatedData = { ...docSnap.data(), ...profileData };
  await updateDoc(docRef, profileData);
  return { id, ...updatedData };
}

/**
 * Alterna status ativo/inativo do usuário
 */
export async function toggleUserActive(id) {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Usuário não encontrado');
  }

  const currentActive = docSnap.data().active;
  await updateDoc(docRef, { active: !currentActive });
  
  return { id, ...docSnap.data(), active: !currentActive };
}
