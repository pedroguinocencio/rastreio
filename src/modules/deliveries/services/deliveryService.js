/**
 * Delivery Service - rastre.io
 * Serviço de gerenciamento de entregas (interno)
 * Conectado ao Firebase Firestore
 */
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where 
} from 'firebase/firestore';
import { db } from '../../../shared/utils/firebase';
import { generateId } from '../../../shared/utils/formatters';

/**
 * Retorna todas as entregas com filtros opcionais
 */
export async function getDeliveries(filters = {}) {
  const deliveriesRef = collection(db, 'deliveries');
  const snapshot = await getDocs(deliveriesRef);
  
  let result = [];
  snapshot.forEach(doc => {
    result.push({ id: doc.id, ...doc.data() });
  });

  // Aplica filtros em memória para evitar exigir a criação de índices compostos complexos no Firebase Console
  if (filters.status) {
    result = result.filter(d => d.status === filters.status);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(d =>
      d.trackingCode.toLowerCase().includes(s) ||
      d.recipientName.toLowerCase().includes(s) ||
      d.senderName.toLowerCase().includes(s)
    );
  }
  if (filters.driverId) {
    result = result.filter(d => d.driverId === filters.driverId);
  }

  // Ordena por mais recente
  result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return result;
}

/**
 * Retorna detalhes completos de uma entrega por ID
 */
export async function getDeliveryById(id) {
  const deliveryRef = doc(db, 'deliveries', id);
  const deliverySnap = await getDoc(deliveryRef);

  if (!deliverySnap.exists()) {
    throw new Error('Encomenda não encontrada');
  }
  const delivery = { id: deliverySnap.id, ...deliverySnap.data() };

  // Busca histórico de status do Firestore
  const historyRef = collection(db, 'statusHistory');
  const qHistory = query(historyRef, where('deliveryId', '==', id));
  const historySnap = await getDocs(qHistory);
  
  let history = [];
  historySnap.forEach(doc => {
    history.push({ id: doc.id, ...doc.data() });
  });
  
  // Ordena o histórico por data decrescente
  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Busca localização do caminhão (se houver placa associada)
  let location = null;
  if (delivery.truckPlate) {
    const locationsRef = collection(db, 'locations');
    const qLoc = query(locationsRef, where('truckPlate', '==', delivery.truckPlate));
    const locSnap = await getDocs(qLoc);
    if (!locSnap.empty) {
      location = { id: locSnap.docs[0].id, ...locSnap.docs[0].data() };
    }
  }

  return { delivery, history, location };
}

/**
 * Atualiza status de uma entrega
 */
export async function updateDeliveryStatus(deliveryId, newStatus, description, user) {
  const deliveryRef = doc(db, 'deliveries', deliveryId);
  const deliverySnap = await getDoc(deliveryRef);
  if (!deliverySnap.exists()) throw new Error('Encomenda não encontrada');

  const now = new Date().toISOString();

  // Atualiza status da encomenda no Firestore
  await updateDoc(deliveryRef, {
    status: newStatus,
    updatedAt: now
  });

  const delivery = { ...deliverySnap.data(), status: newStatus, updatedAt: now, id: deliveryId };

  // Cria entrada no histórico de status
  const historyId = `sh-${generateId()}`;
  const historyEntry = {
    id: historyId,
    deliveryId,
    status: newStatus,
    description,
    location: 'Atualizado via sistema',
    updatedBy: user.id,
    updatedByName: user.name,
    createdAt: now
  };

  const historyRef = doc(db, 'statusHistory', historyId);
  await setDoc(historyRef, historyEntry);

  return { delivery, historyEntry };
}

/**
 * Busca entrega por código de rastreio (para scanner)
 */
export async function getDeliveryByTrackingCode(code) {
  const deliveriesRef = collection(db, 'deliveries');
  const q = query(deliveriesRef, where('trackingCode', '==', code.toUpperCase().trim()));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Código de rastreio não encontrado');
  }

  const docDoc = snapshot.docs[0];
  return { id: docDoc.id, ...docDoc.data() };
}

/**
 * Retorna estatísticas para o dashboard do Firestore
 */
export async function getDashboardStats() {
  const deliveriesRef = collection(db, 'deliveries');
  const delSnapshot = await getDocs(deliveriesRef);
  
  let deliveries = [];
  delSnapshot.forEach(doc => {
    deliveries.push(doc.data());
  });

  const locationsRef = collection(db, 'locations');
  const locSnapshot = await getDocs(locationsRef);
  
  let locations = [];
  locSnapshot.forEach(doc => {
    locations.push(doc.data());
  });

  const total = deliveries.length;
  const pending = deliveries.filter(d => d.status === 'pending').length;
  const collected = deliveries.filter(d => d.status === 'collected').length;
  const inTransit = deliveries.filter(d => d.status === 'in_transit').length;
  const outForDelivery = deliveries.filter(d => d.status === 'out_for_delivery').length;
  const delivered = deliveries.filter(d => d.status === 'delivered').length;
  const returned = deliveries.filter(d => d.status === 'returned').length;

  const trucksOnline = locations.filter(l => l.isOnline).length;
  const trucksTotal = locations.length;

  return {
    total,
    pending,
    collected,
    inTransit,
    outForDelivery,
    delivered,
    returned,
    trucksOnline,
    trucksTotal,
    deliveryRate: total > 0 ? Math.round((delivered / total) * 100) : 0
  };
}
