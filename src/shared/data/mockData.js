/**
 * Mock Data - rastre.io
 * Dados simulados para prototipação do sistema
 * Todos os dados iniciais centralizados aqui
 */

// ==================== USUÁRIOS ====================
export const mockUsers = [
  {
    id: 'usr-001',
    name: 'Carlos Mendes',
    email: 'carlos@locatrans.com',
    password: 'admin123',
    role: 'admin',
    phone: '(11) 99876-5432',
    truckPlate: null,
    active: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'usr-002',
    name: 'Maria Oliveira',
    email: 'maria@locatrans.com',
    password: 'func123',
    role: 'employee',
    phone: '(11) 98765-4321',
    truckPlate: null,
    active: true,
    createdAt: '2024-03-10T08:30:00Z'
  },
  {
    id: 'usr-003',
    name: 'José Santos',
    email: 'jose@locatrans.com',
    password: 'motor123',
    role: 'driver',
    phone: '(11) 97654-3210',
    truckPlate: 'ABC-1D23',
    active: true,
    createdAt: '2024-02-20T14:00:00Z'
  },
  {
    id: 'usr-004',
    name: 'Ana Costa',
    email: 'ana@locatrans.com',
    password: 'motor123',
    role: 'driver',
    phone: '(21) 98888-7777',
    truckPlate: 'XYZ-4E56',
    active: true,
    createdAt: '2024-04-05T09:00:00Z'
  },
  {
    id: 'usr-005',
    name: 'Pedro Lima',
    email: 'pedro@locatrans.com',
    password: 'motor123',
    role: 'driver',
    phone: '(31) 97777-6666',
    truckPlate: 'QWE-7F89',
    active: true,
    createdAt: '2024-05-12T11:00:00Z'
  },
  {
    id: 'usr-006',
    name: 'Fernanda Rocha',
    email: 'fernanda@locatrans.com',
    password: 'func123',
    role: 'employee',
    phone: '(11) 96666-5555',
    truckPlate: null,
    active: false,
    createdAt: '2024-06-01T16:00:00Z'
  }
];

// ==================== ENCOMENDAS ====================
export const mockDeliveries = [
  {
    id: 'del-001',
    trackingCode: 'LCT2025A001',
    status: 'delivered',
    senderName: 'Tech Solutions Ltda',
    senderAddress: 'Av. Paulista, 1000 - São Paulo, SP',
    recipientName: 'João Pereira',
    recipientAddress: 'Rua das Flores, 250 - Campinas, SP',
    recipientPhone: '(19) 98765-4321',
    weight: 2.5,
    description: 'Notebook Dell Inspiron 15',
    driverId: 'usr-003',
    driverName: 'José Santos',
    truckPlate: 'ABC-1D23',
    estimatedDelivery: '2025-05-25',
    createdAt: '2025-05-20T09:00:00Z',
    updatedAt: '2025-05-25T14:30:00Z'
  },
  {
    id: 'del-002',
    trackingCode: 'LCT2025B042',
    status: 'in_transit',
    senderName: 'Magazine Express',
    senderAddress: 'Rua do Comércio, 500 - São Paulo, SP',
    recipientName: 'Maria Souza',
    recipientAddress: 'Av. Brasil, 1200 - Rio de Janeiro, RJ',
    recipientPhone: '(21) 97654-3210',
    weight: 8.3,
    description: 'Geladeira Brastemp Frost Free 375L',
    driverId: 'usr-004',
    driverName: 'Ana Costa',
    truckPlate: 'XYZ-4E56',
    estimatedDelivery: '2025-05-28',
    createdAt: '2025-05-22T11:00:00Z',
    updatedAt: '2025-05-27T08:15:00Z'
  },
  {
    id: 'del-003',
    trackingCode: 'LCT2025C107',
    status: 'out_for_delivery',
    senderName: 'Distribuidora Central',
    senderAddress: 'Rod. Anhanguera, Km 30 - Jundiaí, SP',
    recipientName: 'Carlos Silva',
    recipientAddress: 'Rua Tiradentes, 88 - Sorocaba, SP',
    recipientPhone: '(15) 99876-5432',
    weight: 15.0,
    description: 'Caixa com materiais de construção',
    driverId: 'usr-003',
    driverName: 'José Santos',
    truckPlate: 'ABC-1D23',
    estimatedDelivery: '2025-05-27',
    createdAt: '2025-05-23T07:30:00Z',
    updatedAt: '2025-05-27T10:00:00Z'
  },
  {
    id: 'del-004',
    trackingCode: 'LCT2025D055',
    status: 'collected',
    senderName: 'Farmácia Popular',
    senderAddress: 'Av. Independência, 300 - Santo André, SP',
    recipientName: 'Ana Rodrigues',
    recipientAddress: 'Rua XV de Novembro, 450 - Curitiba, PR',
    recipientPhone: '(41) 98765-1234',
    weight: 0.8,
    description: 'Medicamentos diversos',
    driverId: 'usr-005',
    driverName: 'Pedro Lima',
    truckPlate: 'QWE-7F89',
    estimatedDelivery: '2025-05-30',
    createdAt: '2025-05-26T14:00:00Z',
    updatedAt: '2025-05-27T06:00:00Z'
  },
  {
    id: 'del-005',
    trackingCode: 'LCT2025E200',
    status: 'pending',
    senderName: 'Loja Virtual ABC',
    senderAddress: 'Rua Augusta, 200 - São Paulo, SP',
    recipientName: 'Roberto Almeida',
    recipientAddress: 'Rua Sete de Setembro, 100 - Belo Horizonte, MG',
    recipientPhone: '(31) 97654-9876',
    weight: 3.2,
    description: 'Monitor LG 27" UltraWide',
    driverId: null,
    driverName: null,
    truckPlate: null,
    estimatedDelivery: '2025-06-02',
    createdAt: '2025-05-27T09:00:00Z',
    updatedAt: '2025-05-27T09:00:00Z'
  },
  {
    id: 'del-006',
    trackingCode: 'LCT2025F018',
    status: 'returned',
    senderName: 'E-commerce Brasil',
    senderAddress: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo, SP',
    recipientName: 'Lucia Ferreira',
    recipientAddress: 'Rua Dom Pedro II, 75 - Santos, SP',
    recipientPhone: '(13) 98888-0000',
    weight: 1.5,
    description: 'Smartwatch Samsung Galaxy Watch 5',
    driverId: 'usr-004',
    driverName: 'Ana Costa',
    truckPlate: 'XYZ-4E56',
    estimatedDelivery: '2025-05-24',
    createdAt: '2025-05-19T10:30:00Z',
    updatedAt: '2025-05-26T16:00:00Z'
  }
];

// ==================== HISTÓRICO DE STATUS ====================
export const mockStatusHistory = [
  // del-001 - Entregue (fluxo completo)
  { id: 'sh-001', deliveryId: 'del-001', status: 'pending', description: 'Encomenda registrada no sistema', location: 'São Paulo, SP', updatedBy: 'usr-002', updatedByName: 'Maria Oliveira', createdAt: '2025-05-20T09:00:00Z' },
  { id: 'sh-002', deliveryId: 'del-001', status: 'collected', description: 'Encomenda coletada no remetente', location: 'São Paulo, SP', updatedBy: 'usr-003', updatedByName: 'José Santos', createdAt: '2025-05-21T08:30:00Z' },
  { id: 'sh-003', deliveryId: 'del-001', status: 'in_transit', description: 'Em trânsito para Campinas', location: 'Rodovia Anhanguera, SP', updatedBy: 'usr-003', updatedByName: 'José Santos', createdAt: '2025-05-22T06:00:00Z' },
  { id: 'sh-004', deliveryId: 'del-001', status: 'out_for_delivery', description: 'Saiu para entrega na região de destino', location: 'Campinas, SP', updatedBy: 'usr-003', updatedByName: 'José Santos', createdAt: '2025-05-25T10:00:00Z' },
  { id: 'sh-005', deliveryId: 'del-001', status: 'delivered', description: 'Entregue ao destinatário. Recebido por: João Pereira', location: 'Campinas, SP', updatedBy: 'usr-003', updatedByName: 'José Santos', createdAt: '2025-05-25T14:30:00Z' },

  // del-002 - Em trânsito
  { id: 'sh-006', deliveryId: 'del-002', status: 'pending', description: 'Encomenda registrada no sistema', location: 'São Paulo, SP', updatedBy: 'usr-002', updatedByName: 'Maria Oliveira', createdAt: '2025-05-22T11:00:00Z' },
  { id: 'sh-007', deliveryId: 'del-002', status: 'collected', description: 'Encomenda coletada no centro de distribuição', location: 'São Paulo, SP', updatedBy: 'usr-004', updatedByName: 'Ana Costa', createdAt: '2025-05-23T07:00:00Z' },
  { id: 'sh-008', deliveryId: 'del-002', status: 'in_transit', description: 'Em trânsito para Rio de Janeiro via Dutra', location: 'Rodovia Presidente Dutra, SP', updatedBy: 'usr-004', updatedByName: 'Ana Costa', createdAt: '2025-05-27T08:15:00Z' },

  // del-003 - Saiu para entrega
  { id: 'sh-009', deliveryId: 'del-003', status: 'pending', description: 'Encomenda registrada no sistema', location: 'Jundiaí, SP', updatedBy: 'usr-002', updatedByName: 'Maria Oliveira', createdAt: '2025-05-23T07:30:00Z' },
  { id: 'sh-010', deliveryId: 'del-003', status: 'collected', description: 'Encomenda coletada na distribuidora', location: 'Jundiaí, SP', updatedBy: 'usr-003', updatedByName: 'José Santos', createdAt: '2025-05-24T06:00:00Z' },
  { id: 'sh-011', deliveryId: 'del-003', status: 'in_transit', description: 'Em trânsito para Sorocaba', location: 'Rodovia Castelo Branco, SP', updatedBy: 'usr-003', updatedByName: 'José Santos', createdAt: '2025-05-26T09:00:00Z' },
  { id: 'sh-012', deliveryId: 'del-003', status: 'out_for_delivery', description: 'Saiu para entrega em Sorocaba', location: 'Sorocaba, SP', updatedBy: 'usr-003', updatedByName: 'José Santos', createdAt: '2025-05-27T10:00:00Z' },

  // del-004 - Coletado
  { id: 'sh-013', deliveryId: 'del-004', status: 'pending', description: 'Encomenda registrada no sistema', location: 'Santo André, SP', updatedBy: 'usr-002', updatedByName: 'Maria Oliveira', createdAt: '2025-05-26T14:00:00Z' },
  { id: 'sh-014', deliveryId: 'del-004', status: 'collected', description: 'Encomenda coletada na farmácia', location: 'Santo André, SP', updatedBy: 'usr-005', updatedByName: 'Pedro Lima', createdAt: '2025-05-27T06:00:00Z' },

  // del-005 - Pendente
  { id: 'sh-015', deliveryId: 'del-005', status: 'pending', description: 'Encomenda registrada no sistema, aguardando coleta', location: 'São Paulo, SP', updatedBy: 'usr-002', updatedByName: 'Maria Oliveira', createdAt: '2025-05-27T09:00:00Z' },

  // del-006 - Devolvido
  { id: 'sh-016', deliveryId: 'del-006', status: 'pending', description: 'Encomenda registrada no sistema', location: 'São Paulo, SP', updatedBy: 'usr-002', updatedByName: 'Maria Oliveira', createdAt: '2025-05-19T10:30:00Z' },
  { id: 'sh-017', deliveryId: 'del-006', status: 'collected', description: 'Encomenda coletada', location: 'São Paulo, SP', updatedBy: 'usr-004', updatedByName: 'Ana Costa', createdAt: '2025-05-20T08:00:00Z' },
  { id: 'sh-018', deliveryId: 'del-006', status: 'in_transit', description: 'Em trânsito para Santos', location: 'Rodovia Anchieta, SP', updatedBy: 'usr-004', updatedByName: 'Ana Costa', createdAt: '2025-05-21T07:00:00Z' },
  { id: 'sh-019', deliveryId: 'del-006', status: 'out_for_delivery', description: 'Saiu para entrega em Santos', location: 'Santos, SP', updatedBy: 'usr-004', updatedByName: 'Ana Costa', createdAt: '2025-05-24T09:00:00Z' },
  { id: 'sh-020', deliveryId: 'del-006', status: 'returned', description: 'Destinatário ausente após 3 tentativas. Devolvido ao remetente.', location: 'Santos, SP → São Paulo, SP', updatedBy: 'usr-004', updatedByName: 'Ana Costa', createdAt: '2025-05-26T16:00:00Z' },
];

// ==================== LOCALIZAÇÃO DOS CAMINHÕES ====================
export const mockLocations = [
  {
    id: 'loc-001',
    truckPlate: 'ABC-1D23',
    driverId: 'usr-003',
    driverName: 'José Santos',
    latitude: -23.4705,
    longitude: -47.4553,
    speed: 65,
    heading: 220,
    timestamp: '2025-05-27T13:45:00Z',
    isOnline: true,
    currentCity: 'Sorocaba, SP',
    deliveriesCount: 2
  },
  {
    id: 'loc-002',
    truckPlate: 'XYZ-4E56',
    driverId: 'usr-004',
    driverName: 'Ana Costa',
    latitude: -22.9068,
    longitude: -43.1729,
    speed: 0,
    heading: 0,
    timestamp: '2025-05-27T13:30:00Z',
    isOnline: true,
    currentCity: 'Rio de Janeiro, RJ',
    deliveriesCount: 1
  },
  {
    id: 'loc-003',
    truckPlate: 'QWE-7F89',
    driverId: 'usr-005',
    driverName: 'Pedro Lima',
    latitude: -23.5505,
    longitude: -46.6333,
    speed: 40,
    heading: 180,
    timestamp: '2025-05-27T13:50:00Z',
    isOnline: true,
    currentCity: 'São Paulo, SP',
    deliveriesCount: 1
  },
  {
    id: 'loc-004',
    truckPlate: 'RTY-2G45',
    driverId: null,
    driverName: null,
    latitude: -23.2105,
    longitude: -45.8937,
    speed: 0,
    heading: 0,
    timestamp: '2025-05-26T18:00:00Z',
    isOnline: false,
    currentCity: 'São José dos Campos, SP',
    deliveriesCount: 0
  }
];
