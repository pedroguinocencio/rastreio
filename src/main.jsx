/**
 * main.jsx - rastre.io
 * Entry point da aplicação React
 * Importa CSS global antes de renderizar a app
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { seedDatabaseIfEmpty } from './shared/utils/firebase';

// CSS Global — ordem importa
import './shared/styles/reset.css';
import './shared/styles/index.css';
import './shared/styles/components.css';

// Inicializa a semeadura do banco de dados Firebase
seedDatabaseIfEmpty();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

