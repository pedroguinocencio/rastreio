/**
 * DeliveriesListPage - rastre.io
 * Lista de encomendas com filtros e busca
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDeliveries } from '../services/deliveryService';
import { DELIVERY_STATUS } from '../../../shared/utils/constants';
import { formatDateTime, formatDate } from '../../../shared/utils/formatters';
import { Loading } from '../../../shared/components/Loading';
import { EmptyState } from '../../../shared/components/EmptyState';
import {
  Search, Package, ChevronRight, X
} from 'lucide-react';
import './deliveries.css';

export default function DeliveriesListPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function loadDeliveries() {
      setLoading(true);
      try {
        const data = await getDeliveries({ search, status: statusFilter });
        setDeliveries(data);
      } catch (err) {
        console.error('Erro ao carregar entregas:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDeliveries();
  }, [search, statusFilter]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
  };

  const hasFilters = search || statusFilter;

  return (
    <div className="deliveries-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Entregas</h1>
          <p className="page-subtitle">Gerenciar e acompanhar todas as encomendas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="deliveries-filters animate-fade-in">
        <div className="deliveries-search">
          <Search size={16} className="deliveries-search-icon" />
          <input
            type="text"
            placeholder="Buscar por código, nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            id="deliveries-search"
          />
        </div>

        <select
          className="select-field deliveries-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          id="deliveries-status-filter"
        >
          <option value="">Todos os status</option>
          {Object.entries(DELIVERY_STATUS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
            <X size={14} />
            Limpar
          </button>
        )}
      </div>

      {/* Tabela */}
      {loading ? (
        <Loading />
      ) : deliveries.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhuma encomenda encontrada"
          description={hasFilters ? 'Tente ajustar os filtros de busca' : 'Nenhuma encomenda registrada'}
          action={hasFilters && (
            <button className="btn btn-secondary" onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
        />
      ) : (
        <div className="table-container animate-fade-in-up">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Destinatário</th>
                <th>Status</th>
                <th>Motorista</th>
                <th>Previsão</th>
                <th>Atualizado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => {
                const statusInfo = DELIVERY_STATUS[delivery.status];
                return (
                  <tr key={delivery.id}>
                    <td>
                      <span className="delivery-code-cell">{delivery.trackingCode}</span>
                    </td>
                    <td>
                      <div className="delivery-recipient-cell">
                        <span className="delivery-recipient-name">{delivery.recipientName}</span>
                        <span className="delivery-recipient-desc">{delivery.description}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${statusInfo.color} badge-dot`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <span className="delivery-driver-cell">
                        {delivery.driverName || '—'}
                      </span>
                    </td>
                    <td>{formatDate(delivery.estimatedDelivery)}</td>
                    <td className="delivery-updated-cell">
                      {formatDateTime(delivery.updatedAt)}
                    </td>
                    <td>
                      <Link
                        to={`/app/entregas/${delivery.id}`}
                        className="btn btn-ghost btn-icon"
                        title="Ver detalhes"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
