/**
 * Firebase Config - rastre.io
 * Inicializa a conexão com o Firestore e fornece a rotina de auto-semeadura (seeding)
 */
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { mockDeliveries, mockStatusHistory, mockLocations } from '../data/mockData';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDfpSZvPybhBfabW75drHJbiBJbq6hPW_c',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'rastreio-a4b91.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'rastreio-a4b91',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'rastreio-a4b91.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '176201385662',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:176201385662:web:902f4d53e56e97a2ef40ef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-RN33MD2757'
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

if (import.meta.env.DEV && import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL) {
  connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL, {
    disableWarnings: true
  });
}

/**
 * Função de semeadura automática do Firestore se as coleções estiverem vazias.
 * Isso garante que o protótipo venha pré-populado com os usuários e encomendas padrão da Locatrans.
 */
export async function seedDatabaseIfEmpty() {
  try {
    const deliveriesRef = collection(db, 'deliveries');
    const deliveriesSnap = await getDocs(deliveriesRef);

    if (deliveriesSnap.empty) {
      console.log('[Firebase Seeding] Coleção de entregas vazia. Iniciando semeadura de dados mockados...');
      const batch = writeBatch(db);

      // 1. Semear Encomendas
      mockDeliveries.forEach((delivery) => {
        const docRef = doc(db, 'deliveries', delivery.id);
        batch.set(docRef, delivery);
      });

      // 2. Semear Histórico de Status
      mockStatusHistory.forEach((history) => {
        const docRef = doc(db, 'statusHistory', history.id);
        batch.set(docRef, history);
      });

      // 3. Semear Localizações da Frota
      mockLocations.forEach((loc) => {
        const docRef = doc(db, 'locations', loc.id);
        batch.set(docRef, loc);
      });

      await batch.commit();
      console.log('[Firebase Seeding] Banco de dados Firestore semeado com sucesso!');
    } else {
      console.log('[Firebase Seeding] Firestore já contém dados. Pulando semeadura.');
    }
  } catch (error) {
    console.error('[Firebase Seeding] Erro ao semear o Firestore:', error);
  }
}

export { app, auth, db };
