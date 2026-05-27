/**
 * Tracking Service - rastre.io
 * Serviço de rastreamento público de encomendas
 * Simula chamadas de API com dados mock
 */
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../shared/utils/firebase';
import { TRACKING_CODE_REGEX } from '../../../shared/utils/constants';

/**
 * Valida formato do código de rastreio
 */
export function validateTrackingCode(code) {
  if (!code || typeof code !== 'string') {
    return { valid: false, message: 'Informe um código de rastreio' };
  }
  const cleaned = code.trim().toUpperCase();
  if (cleaned.length < 8 || cleaned.length > 12) {
    return { valid: false, message: 'O código deve ter entre 8 e 12 caracteres' };
  }
  if (!TRACKING_CODE_REGEX.test(cleaned)) {
    return { valid: false, message: 'O código deve conter apenas letras maiúsculas e números' };
  }
  return { valid: true, code: cleaned };
}

/**
 * Busca encomenda por código de rastreio (público)
 */
export async function trackDelivery(code) {
  const validation = validateTrackingCode(code);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  // Busca encomenda no Firestore
  const deliveriesRef = collection(db, 'deliveries');
  const qDel = query(deliveriesRef, where('trackingCode', '==', validation.code));
  const delSnap = await getDocs(qDel);

  if (delSnap.empty) {
    throw new Error('Código de rastreio não encontrado. Verifique o código e tente novamente.');
  }

  const deliveryDoc = delSnap.docs[0];
  const delivery = { id: deliveryDoc.id, ...deliveryDoc.data() };

  // Busca histórico de status do Firestore
  const historyRef = collection(db, 'statusHistory');
  const qHistory = query(historyRef, where('deliveryId', '==', delivery.id));
  const historySnap = await getDocs(qHistory);
  
  let history = [];
  historySnap.forEach(doc => {
    history.push({ id: doc.id, ...doc.data() });
  });
  
  // Ordena o histórico por data decrescente
  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Busca localização do caminhão (se houver)
  let location = null;
  if (delivery.truckPlate) {
    const locationsRef = collection(db, 'locations');
    const qLoc = query(locationsRef, where('truckPlate', '==', delivery.truckPlate));
    const locSnap = await getDocs(qLoc);
    if (!locSnap.empty) {
      location = { id: locSnap.docs[0].id, ...locSnap.docs[0].data() };
    }
  }

  return {
    delivery,
    history,
    location
  };
}
