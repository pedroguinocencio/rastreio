import { Loader2 } from 'lucide-react';

/**
 * Componente de loading com spinner animado
 */
export function Loading({ message = 'Carregando...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Loading inline menor para botões
 */
export function LoadingInline() {
  return <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />;
}
