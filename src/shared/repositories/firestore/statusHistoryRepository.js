/**
 * Firestore Status History Repository - rastre.io
 * CRUD no Firestore para histórico de status
 */
import { collection, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const COLLECTION = 'statusHistory';

export async function getByDeliveryId(deliveryId) {
  const q = query(
    collection(db, COLLECTION),
    where('deliveryId', '==', deliveryId)
  );
  const snapshot = await getDocs(q);

  const result = [];
  snapshot.forEach((d) => result.push({ id: d.id, ...d.data() }));
  return result;
}

export async function create(entry) {
  const ref = doc(db, COLLECTION, entry.id);
  await setDoc(ref, entry);
  return { ...entry };
}
