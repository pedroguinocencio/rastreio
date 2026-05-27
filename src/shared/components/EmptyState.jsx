import { Package } from 'lucide-react';

/**
 * Componente para estados vazios (sem dados)
 */
export function EmptyState({ 
  icon: Icon = Package, 
  title = 'Nenhum item encontrado', 
  description = '',
  action 
}) {
  return (
    <div className="empty-state">
      <Icon className="empty-state-icon" />
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && action}
    </div>
  );
}
