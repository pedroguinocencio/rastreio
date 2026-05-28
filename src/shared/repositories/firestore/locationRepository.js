/**
 * Firestore Location Repository - rastre.io
 * CRUD no Firestore para localizações da frota
 */
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const COLLECTION = 'locations';

export async function getAll() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const result = [];
  snapshot.forEach((d) => result.push({ id: d.id, ...d.data() }));
  return result;
}

export async function getByTruckPlate(truckPlate) {
  const q = query(
    collection(db, COLLECTION),
    where('truckPlate', '==', truckPlate)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error('Caminhão não encontrado');
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() };
}
