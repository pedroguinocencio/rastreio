/**
 * DeliveryDetailPage - rastre.io
 * Detalhes completos de uma encomenda com timeline e ações
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getDeliveryById, updateDeliveryStatus } from '../services/deliveryService';
import { DELIVERY_STATUS } from '../../../shared/utils/constants';
import { formatDateTime, formatDate, formatWeight } from '../../../shared/utils/formatters';
import { Loading } from '../../../shared/components/Loading';
import {
  ArrowLeft, Package, MapPin, User,
  Truck, CheckCircle2, Clock, RotateCcw,
  Navigation, PackageCheck, Edit3, X
} from 'lucide-react';
import './deliveries.css';

const STATUS_ICONS = {
  pending: Clock, collected: PackageCheck, in_transit: Truck,
  out_for_delivery: Navigation, delivered: CheckCircle2, returned: RotateCcw
};

export default function DeliveryDetailPage() {
  const { id } = useParams();
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusDescription, setStatusDescription] = useState('');
  const [updating, setUpdating] = useState(false);

  const refreshDelivery = async () => {
    setLoading(true);
    try {
      const result = await getDeliveryById(id);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadDelivery() {
      setLoading(true);
      try {
        const result = await getDeliveryById(id);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDelivery();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!newStatus || !statusDescription) return;
    setUpdating(true);
    try {
      await updateDeliveryStatus(id, newStatus, statusDescription, user);
      await refreshDelivery();
      setShowUpdateModal(false);
      setNewStatus('');
      setStatusDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loading message="Carregando detalhes..." />;
  if (!data) return <div>Encomenda não encontrada</div>;

  const { delivery, history } = data;
  const statusInfo = DELIVERY_STATUS[delivery.status];
  const canUpdate = hasPermission('deliveries.update');

  return (
    <div className="delivery-detail-page">
      {/* Header */}
      <div className="detail-header animate-fade-in">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          Voltar
        </button>
        <div className="detail-header-info">
          <h1 className="page-title">{delivery.trackingCode}</h1>
          <span className={`badge badge-${statusInfo.color} badge-dot`}>
            {statusInfo.label}
          </span>
        </div>
        {canUpdate && delivery.status !== 'delivered' && delivery.status !== 'returned' && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowUpdateModal(true)}
          >
            <Edit3 size={16} />
            Atualizar Status
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="detail-grid">
        {/* Encomenda */}
        <div className="card animate-fade-in-up stagger-1">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={18} style={{ color: 'var(--primary)' }} />
            Encomenda
          </h3>
          <div className="detail-info-list">
            <div className="detail-info-row">
              <span>Descrição</span>
              <span>{delivery.description}</span>
            </div>
            <div className="detail-info-row">
              <span>Peso</span>
              <span>{formatWeight(delivery.weight)}</span>
            </div>
            <div className="detail-info-row">
              <span>Previsão de Entrega</span>
              <span>{formatDate(delivery.estimatedDelivery)}</span>
            </div>
            <div className="detail-info-row">
              <span>Criado em</span>
              <span>{formatDateTime(delivery.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Remetente */}
        <div className="card animate-fade-in-up stagger-2">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} style={{ color: 'var(--primary)' }} />
            Remetente
          </h3>
          <div className="detail-info-list">
            <div className="detail-info-row">
              <span>Nome</span>
              <span>{delivery.senderName}</span>
            </div>
            <div className="detail-info-row">
              <span>Endereço</span>
              <span>{delivery.senderAddress}</span>
            </div>
          </div>
        </div>

        {/* Destinatário */}
        <div className="card animate-fade-in-up stagger-3">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} style={{ color: 'var(--primary)' }} />
            Destinatário
          </h3>
          <div className="detail-info-list">
            <div className="detail-info-row">
              <span>Nome</span>
              <span>{delivery.recipientName}</span>
            </div>
            <div className="detail-info-row">
              <span>Endereço</span>
              <span>{delivery.recipientAddress}</span>
            </div>
            <div className="detail-info-row">
              <span>Telefone</span>
              <span>{delivery.recipientPhone}</span>
            </div>
          </div>
        </div>

        {/* Transporte */}
        <div className="card animate-fade-in-up stagger-4">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} style={{ color: 'var(--primary)' }} />
            Transporte
          </h3>
          <div className="detail-info-list">
            <div className="detail-info-row">
              <span>Motorista</span>
              <span>{delivery.driverName || '—'}</span>
            </div>
            <div className="detail-info-row">
              <span>Placa</span>
              <span>{delivery.truckPlate || '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card animate-fade-in-up stagger-5">
        <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-6)' }}>
          <Clock size={18} style={{ color: 'var(--primary)' }} />
          Histórico de Status
        </h3>
        <div className="detail-timeline">
          {history.map((entry, index) => {
            const entryStatus = DELIVERY_STATUS[entry.status];
            const EntryIcon = STATUS_ICONS[entry.status];
            return (
              <div key={entry.id} className={`timeline-item-dark ${index === 0 ? 'timeline-item-current-dark' : ''}`}>
                <div className={`timeline-dot timeline-dot-${entryStatus.color}`}>
                  <EntryIcon size={14} />
                </div>
                {index < history.length - 1 && <div className="timeline-line-dark" />}
                <div className="timeline-content-dark">
                  <div className="timeline-header-dark">
                    <span className={`badge badge-${entryStatus.color}`}>{entryStatus.label}</span>
                    <span className="timeline-date-dark">{formatDateTime(entry.createdAt)}</span>
                  </div>
                  <p className="timeline-desc-dark">{entry.description}</p>
                  <div className="timeline-meta-dark">
                    <span><MapPin size={12} /> {entry.location}</span>
                    <span><User size={12} /> {entry.updatedByName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de atualização */}
      {showUpdateModal && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Atualizar Status</h3>
              <button className="modal-close" onClick={() => setShowUpdateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div className="input-group">
                <label>Novo Status</label>
                <select
                  className="select-field"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {Object.entries(DELIVERY_STATUS).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Descrição da atualização</label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Descreva a atualização..."
                  value={statusDescription}
                  onChange={(e) => setStatusDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateStatus}
                disabled={!newStatus || !statusDescription || updating}
              >
                {updating ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
