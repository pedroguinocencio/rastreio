import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import { mockDeliveries, mockLocations, mockStatusHistory, mockUsers } from '../src/shared/data/mockData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const envPath = path.join(projectRoot, '.env');

function loadEnv() {
  if (!fs.existsSync(envPath)) {
    throw new Error('Arquivo .env não encontrado na raiz do projeto.');
  }

  const env = {};
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '');
    env[key] = value;
  }

  return env;
}

function requireEnv(env, key) {
  if (!env[key]) {
    throw new Error(`Variável ${key} não está preenchida no .env.`);
  }
  return env[key];
}

function getFirebaseConfig(env) {
  return {
    apiKey: requireEnv(env, 'VITE_FIREBASE_API_KEY'),
    authDomain: requireEnv(env, 'VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: requireEnv(env, 'VITE_FIREBASE_PROJECT_ID'),
    storageBucket: requireEnv(env, 'VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requireEnv(env, 'VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requireEnv(env, 'VITE_FIREBASE_APP_ID'),
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
  };
}

function setDocs(batch, collectionName, docs) {
  for (const data of docs) {
    batch.set(doc(db, collectionName, data.id), data);
  }
}

const env = loadEnv();
const app = initializeApp(getFirebaseConfig(env));
const auth = getAuth(app);
const db = getFirestore(app);

const seedEmail = process.env.SEED_FIREBASE_EMAIL || env.SEED_FIREBASE_EMAIL;
const seedPassword = process.env.SEED_FIREBASE_PASSWORD || env.SEED_FIREBASE_PASSWORD;

try {
  if (seedEmail && seedPassword) {
    console.log(`Autenticando como ${seedEmail}...`);
    await signInWithEmailAndPassword(auth, seedEmail, seedPassword);
  } else {
    console.log('Rodando sem autenticação. Isso só funciona se as regras do Firestore permitirem escrita.');
  }

  const safeUsers = mockUsers.map((user) => {
    const profile = { ...user };
    delete profile.password;
    return profile;
  });

  const batch = writeBatch(db);
  setDocs(batch, 'deliveries', mockDeliveries);
  setDocs(batch, 'statusHistory', mockStatusHistory);
  setDocs(batch, 'locations', mockLocations);
  setDocs(batch, 'users', safeUsers);

  await batch.commit();

  console.log('Seed concluído com sucesso.');
  console.log(`deliveries: ${mockDeliveries.length}`);
  console.log(`statusHistory: ${mockStatusHistory.length}`);
  console.log(`locations: ${mockLocations.length}`);
  console.log(`users: ${safeUsers.length}`);
  process.exit(0);
} catch (error) {
  console.error('Seed falhou.');
  console.error(`Código: ${error.code || 'sem código'}`);
  console.error(`Mensagem: ${error.message}`);
  process.exit(1);
}
