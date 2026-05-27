/**
 * Location Service - rastre.io
 * Serviço de localização da frota (simulado)
 */
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../shared/utils/firebase';

/**
 * Retorna localização de todos os caminhões
 */
export async function getFleetLocations() {
  const locationsRef = collection(db, 'locations');
  const snapshot = await getDocs(locationsRef);
  
  let result = [];
  snapshot.forEach(doc => {
    result.push({ id: doc.id, ...doc.data() });
  });
  return result;
}

/**
 * Retorna localização de um caminhão específico
 */
export async function getTruckLocation(truckPlate) {
  const locationsRef = collection(db, 'locations');
  const q = query(locationsRef, where('truckPlate', '==', truckPlate));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Caminhão não encontrado');
  }

  const docDoc = snapshot.docs[0];
  return { id: docDoc.id, ...docDoc.data() };
}
