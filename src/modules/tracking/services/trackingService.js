/**
 * Tracking Service - rastre.io
 * Serviço de rastreamento público de encomendas
 * Lógica de negócio — acesso a dados via repositórios Firestore
 */
import { deliveryRepo, statusHistoryRepo, locationRepo } from '../../../shared/repositories';
import { TRACKING_CODE_REGEX } from '../../../shared/utils/constants';

/**
 * Valida formato do código de rastreio
 */
export function validateTrackingCode(code) {
  if (!code || typeof code !== 'string') {
    return { valid: false, message: 'Informe um código de rastreio' };
  }
  const cleaned = code.trim().toUpperCase();
  if (cleaned.length < 8 || cleaned.length > 12) {
    return { valid: false, message: 'O código deve ter entre 8 e 12 caracteres' };
  }
  if (!TRACKING_CODE_REGEX.test(cleaned)) {
    return { valid: false, message: 'O código deve conter apenas letras maiúsculas e números' };
  }
  return { valid: true, code: cleaned };
}

/**
 * Busca encomenda por código de rastreio (público)
 */
export async function trackDelivery(code) {
  const validation = validateTrackingCode(code);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  // Busca encomenda via repositório
  const delivery = await deliveryRepo.getByTrackingCode(validation.code);

  // Busca histórico de status
  const history = await statusHistoryRepo.getByDeliveryId(delivery.id);
  history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Busca localização do caminhão se houver placa associada
  let location = null;
  if (delivery.truckPlate) {
    try {
      location = await locationRepo.getByTruckPlate(delivery.truckPlate);
    } catch {
      // Ignora se não encontrar localização
    }
  }

  return {
    delivery,
    history,
    location
  };
}
