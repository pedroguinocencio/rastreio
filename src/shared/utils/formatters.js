/**
 * Utilitários de formatação - rastre.io
 * Funções para formatar datas, textos e valores
 */

/**
 * Formata data ISO para formato brasileiro (dd/mm/aaaa HH:mm)
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formata data ISO para formato curto (dd/mm/aaaa)
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formata data ISO para horário (HH:mm)
 */
export function formatTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Retorna "há X minutos/horas/dias" relativo a agora
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  return formatDate(isoString);
}

/**
 * Formata peso em kg
 */
export function formatWeight(kg) {
  if (kg == null) return '—';
  return `${Number(kg).toFixed(1)} kg`;
}

/**
 * Gera as iniciais de um nome (máximo 2 letras)
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Trunca texto longo com reticências
 */
export function truncate(text, maxLength = 50) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

/**
 * Gera um ID único simples (para mock)
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Gera código de rastreio válido (para mock)
 * Formato: LCT + ano + letra + 3 dígitos (total: 10 chars)
 */
export function generateTrackingCode() {
  const year = new Date().getFullYear();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const num = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `LCT${year}${letter}${num}`;
}
