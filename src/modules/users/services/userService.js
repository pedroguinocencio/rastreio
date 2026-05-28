/**
 * User Service - rastre.io
 * Serviço de gerenciamento de usuários (admin)
 * Lógica de negócio — acesso a dados via repositório Firestore
 */
import { userRepo } from '../../../shared/repositories';

/**
 * Retorna todos os usuários com filtros opcionais
 */
export async function getUsers(filters = {}) {
  let result = await userRepo.getAll();

  if (filters.role) {
    result = result.filter((u) => u.role === filters.role);
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(
      (u) =>
        u.name?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s)
    );
  }
  return result;
}

/**
 * Retorna um usuário por ID
 */
export async function getUserById(id) {
  return userRepo.getById(id);
}

/**
 * Cria novo usuário
 */
export async function createUser(data) {
  return userRepo.create(data);
}

/**
 * Atualiza usuário existente
 */
export async function updateUser(id, data) {
  return userRepo.update(id, data);
}

/**
 * Alterna status ativo/inativo do usuário
 */
export async function toggleUserActive(id) {
  return userRepo.toggleActive(id);
}
