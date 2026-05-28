/**
 * Delivery Service - rastre.io
 * Serviço de gerenciamento de entregas (interno)
 * Lógica de negócio — acesso a dados via repositórios Firestore
 */
import { deliveryRepo, statusHistoryRepo, locationRepo } from '../../../shared/repositories';
import { generateId } from '../../../shared/utils/formatters';

/**
 * Retorna todas as entregas com filtros opcionais
 */
export async function getDeliveries(filters = {}) {
  let result = await deliveryRepo.getAll();

  if (filters.status) {
    result = result.filter((d) => d.status === filters.status);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (d) =>
        d.trackingCode?.toLowerCase().includes(s) ||
        d.recipientName?.toLowerCase().includes(s) ||
        d.senderName?.toLowerCase().includes(s)
    );
  }
  if (filters.driverId) {
    result = result.filter((d) => d.driverId === filters.driverId);
  }

  result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return result;
}

/**
 * Retorna detalhes completos de uma entrega por ID
 */
export async function getDeliveryById(id) {
  const delivery = await deliveryRepo.getById(id);

  // Busca histórico de status
  const history = await statusHistoryRepo.getByDeliveryId(id);
  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Busca localização do caminhão se houver placa associada
  let location = null;
  if (delivery.truckPlate) {
    try {
      location = await locationRepo.getByTruckPlate(delivery.truckPlate);
    } catch {
      // Ignora erro se não encontrar a localização do caminhão
    }
  }

  return { delivery, history, location };
}

/**
 * Atualiza status de uma entrega
 */
export async function updateDeliveryStatus(deliveryId, newStatus, description, user) {
  const now = new Date().toISOString();

  // Atualiza status da encomenda
  const delivery = await deliveryRepo.update(deliveryId, {
    status: newStatus,
    updatedAt: now
  });

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

  await statusHistoryRepo.create(historyEntry);

  return { delivery, historyEntry };
}

/**
 * Busca entrega por código de rastreio (para scanner/público)
 */
export async function getDeliveryByTrackingCode(code) {
  return deliveryRepo.getByTrackingCode(code);
}

/**
 * Retorna estatísticas para o dashboard
 */
export async function getDashboardStats() {
  const [deliveries, locations] = await Promise.all([
    deliveryRepo.getAll(),
    locationRepo.getAll()
  ]);

  const total = deliveries.length;
  const pending = deliveries.filter((d) => d.status === 'pending').length;
  const collected = deliveries.filter((d) => d.status === 'collected').length;
  const inTransit = deliveries.filter((d) => d.status === 'in_transit').length;
  const outForDelivery = deliveries.filter((d) => d.status === 'out_for_delivery').length;
  const delivered = deliveries.filter((d) => d.status === 'delivered').length;
  const returned = deliveries.filter((d) => d.status === 'returned').length;

  const trucksOnline = locations.filter((l) => l.isOnline).length;
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
