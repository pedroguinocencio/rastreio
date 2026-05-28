/**
 * Firestore Delivery Repository - rastre.io
 * CRUD no Firestore para encomendas
 */
import {
  collection, doc, getDoc, getDocs, updateDoc, query, where
} from 'firebase/firestore';
import { db } from '../../utils/firebase';

const COLLECTION = 'deliveries';

export function getAll() {
  return getDocs(collection(db, COLLECTION)).then((snapshot) => {
    const result = [];
    snapshot.forEach((d) => result.push({ id: d.id, ...d.data() }));
    return result;
  });
}

export async function getById(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Encomenda não encontrada');
  return { id: snap.id, ...snap.data() };
}

export async function getByTrackingCode(code) {
  const q = query(
    collection(db, COLLECTION),
    where('trackingCode', '==', code.toUpperCase().trim())
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error('Código de rastreio não encontrado');
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() };
}

export async function update(id, data) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Encomenda não encontrada');

  await updateDoc(ref, data);
  return { id, ...snap.data(), ...data };
}
