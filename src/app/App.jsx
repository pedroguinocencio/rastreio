/**
 * App.jsx - rastre.io
 * Componente raiz da aplicação
 * Envolve toda a app com AuthProvider e Toast notifications
 */
import { AuthProvider } from '../modules/auth/context/AuthContext';
import { useToast } from '../shared/hooks/useToast';
import { ToastContainer } from '../shared/components/Toast';
import AppRouter from './router/AppRouter';

export default function App() {
  const { toasts, removeToast } = useToast();

  return (
    <AuthProvider>
      <AppRouter />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AuthProvider>
  );
}
