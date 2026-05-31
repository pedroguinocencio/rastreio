/**
 * Constantes do sistema rastre.io
 * Centraliza todos os valores constantes usados no sistema
 */

// Status possíveis das encomendas com labels e cores
export const DELIVERY_STATUS = {
  pending: {
    key: 'pending',
    label: 'Pendente',
    color: 'neutral',
    icon: 'Clock',
    description: 'Aguardando coleta'
  },
  collected: {
    key: 'collected',
    label: 'Coletado',
    color: 'info',
    icon: 'PackageCheck',
    description: 'Encomenda coletada pelo motorista'
  },
  in_transit: {
    key: 'in_transit',
    label: 'Em Trânsito',
    color: 'warning',
    icon: 'Truck',
    description: 'Em rota de entrega'
  },
  out_for_delivery: {
    key: 'out_for_delivery',
    label: 'Saiu para Entrega',
    color: 'primary',
    icon: 'Navigation',
    description: 'Motorista a caminho do destino'
  },
  delivered: {
    key: 'delivered',
    label: 'Entregue',
    color: 'success',
    icon: 'CheckCircle2',
    description: 'Encomenda entregue ao destinatário'
  },
  returned: {
    key: 'returned',
    label: 'Devolvido',
    color: 'danger',
    icon: 'RotateCcw',
    description: 'Encomenda devolvida ao remetente'
  }
};

// Perfis de usuário e suas permissões
export const USER_ROLES = {
  admin: {
    key: 'admin',
    label: 'Administrador',
    description: 'Acesso completo ao sistema',
    permissions: [
      'dashboard.view',
      'deliveries.view',
      'deliveries.create',
      'deliveries.update',
      'deliveries.delete',
      'fleet.view',
      'scanner.use',
      'reports.view',
      'users.manage'
    ]
  },
  employee: {
    key: 'employee',
    label: 'Funcionário',
    description: 'Visualização e operação de entregas',
    permissions: [
      'dashboard.view',
      'deliveries.view',
      'deliveries.create',
      'deliveries.update',
      'fleet.view',
      'reports.view'
    ]
  },
  driver: {
    key: 'driver',
    label: 'Motorista',
    description: 'Atualização de status e scanner',
    permissions: [
      'dashboard.view',
      'deliveries.view',
      'deliveries.update',
      'scanner.use'
    ]
  }
};

// Labels de permissões para exibição
export const PERMISSION_LABELS = {
  'dashboard.view': 'Visualizar Dashboard',
  'deliveries.view': 'Visualizar Entregas',
  'deliveries.create': 'Criar Entregas',
  'deliveries.update': 'Atualizar Entregas',
  'deliveries.delete': 'Excluir Entregas',
  'fleet.view': 'Visualizar Frota',
  'scanner.use': 'Usar Scanner QR',
  'reports.view': 'Visualizar Relatórios',
  'users.manage': 'Gerenciar Usuários'
};

// Validação de código de rastreio
export const TRACKING_CODE_REGEX = /^[A-Z0-9]{8,12}$/;
export const TRACKING_CODE_MIN_LENGTH = 8;
export const TRACKING_CODE_MAX_LENGTH = 12;

// Itens de menu da sidebar por perfil
export const SIDEBAR_ITEMS = [
  { path: '/app/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', permission: 'dashboard.view' },
  { path: '/app/entregas', label: 'Entregas', icon: 'Package', permission: 'deliveries.view' },
  { path: '/app/frota', label: 'Frota', icon: 'Map', permission: 'fleet.view' },
  { path: '/app/scanner', label: 'Scanner QR', icon: 'ScanLine', permission: 'scanner.use' },
  { path: '/app/usuarios', label: 'Usuários', icon: 'Users', permission: 'users.manage' },
];
