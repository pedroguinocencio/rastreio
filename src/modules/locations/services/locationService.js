/**
 * Location Service - rastre.io
 * Serviço de localização da frota
 * Acesso a dados via repositório Firestore
 */
import { locationRepo } from '../../../shared/repositories';

/**
 * Retorna localização de todos os caminhões
 */
export async function getFleetLocations() {
  return locationRepo.getAll();
}

/**
 * Retorna localização de um caminhão específico
 */
export async function getTruckLocation(truckPlate) {
  return locationRepo.getByTruckPlate(truckPlate);
}
