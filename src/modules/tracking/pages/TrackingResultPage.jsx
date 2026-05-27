/**
 * TrackingResultPage - rastre.io
 * Resultado da consulta pública de rastreamento
 * Exibe status, informações da encomenda, timeline e mapa
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Package, MapPin, User,
  Truck, CheckCircle2, Clock, RotateCcw,
  Navigation, PackageCheck, AlertCircle, Search
} from 'lucide-react';
import { trackDelivery } from '../services/trackingService';
import { DELIVERY_STATUS } from '../../../shared/utils/constants';
import { formatDateTime, formatDate, formatWeight } from '../../../shared/utils/formatters';
import { Loading } from '../../../shared/components/Loading';
import './tracking.css';

// Mapeamento de ícones para status
const STATUS_ICONS = {
  pending: Clock,
  collected: PackageCheck,
  in_transit: Truck,
  out_for_delivery: Navigation,
  delivered: CheckCircle2,
  returned: RotateCcw
};

export default function TrackingResultPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTracking() {
      setLoading(true);
      setError('');
      try {
        const result = await trackDelivery(code);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTracking();
  }, [code]);

  if (loading) {
    return (
      <div className="tracking-result-page">
        <Loading message="Buscando sua encomenda..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-result-page">
        <div className="tracking-error-card animate-scale-in">
          <AlertCircle size={48} className="tracking-error-icon" />
          <h2>Encomenda não encontrada</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary btn-lg">
            <Search size={18} />
            Nova consulta
          </Link>
        </div>
      </div>
    );
  }

  const { delivery, history } = data;
  const statusInfo = DELIVERY_STATUS[delivery.status];
  const StatusIcon = STATUS_ICONS[delivery.status];

  return (
    <div className="tracking-result-page">
      <div className="tracking-result-container">
        {/* Header com botão voltar */}
        <Link to="/" className="tracking-back-link animate-fade-in">
          <ArrowLeft size={18} />
          Nova consulta
        </Link>

        {/* Status Card Principal */}
        <div className={`tracking-status-card tracking-status-${statusInfo.color} animate-fade-in-up`}>
          <div className="tracking-status-icon-large">
            <StatusIcon size={32} />
          </div>
          <div className="tracking-status-content">
            <span className="tracking-status-label">Status atual</span>
            <h2 className="tracking-status-title">{statusInfo.label}</h2>
            <p className="tracking-status-description">{statusInfo.description}</p>
          </div>
          <div className="tracking-code-display">
            <span className="tracking-code-label">Código</span>
            <span className="tracking-code-value">{delivery.trackingCode}</span>
          </div>
        </div>

        {/* Grid de informações */}
        <div className="tracking-info-grid">
          {/* Informações da encomenda */}
          <div className="tracking-info-card animate-fade-in-up stagger-1">
            <h3 className="tracking-info-title">
              <Package size={18} />
              Informações da Encomenda
            </h3>
            <div className="tracking-info-list">
              <div className="tracking-info-item">
                <span className="tracking-info-label">Descrição</span>
                <span className="tracking-info-value">{delivery.description}</span>
              </div>
              <div className="tracking-info-item">
                <span className="tracking-info-label">Peso</span>
                <span className="tracking-info-value">{formatWeight(delivery.weight)}</span>
              </div>
              <div className="tracking-info-item">
                <span className="tracking-info-label">Previsão de Entrega</span>
                <span className="tracking-info-value">{formatDate(delivery.estimatedDelivery)}</span>
              </div>
            </div>
          </div>

          {/* Remetente */}
          <div className="tracking-info-card animate-fade-in-up stagger-2">
            <h3 className="tracking-info-title">
              <User size={18} />
              Remetente
            </h3>
            <div className="tracking-info-list">
              <div className="tracking-info-item">
                <span className="tracking-info-label">Nome</span>
                <span className="tracking-info-value">{delivery.senderName}</span>
              </div>
              <div className="tracking-info-item">
                <span className="tracking-info-label">Endereço</span>
                <span className="tracking-info-value">{delivery.senderAddress}</span>
              </div>
            </div>
          </div>

          {/* Destinatário */}
          <div className="tracking-info-card animate-fade-in-up stagger-3">
            <h3 className="tracking-info-title">
              <MapPin size={18} />
              Destinatário
            </h3>
            <div className="tracking-info-list">
              <div className="tracking-info-item">
                <span className="tracking-info-label">Nome</span>
                <span className="tracking-info-value">{delivery.recipientName}</span>
              </div>
              <div className="tracking-info-item">
                <span className="tracking-info-label">Endereço</span>
                <span className="tracking-info-value">{delivery.recipientAddress}</span>
              </div>
            </div>
          </div>

          {/* Motorista / Veículo */}
          {delivery.driverName && (
            <div className="tracking-info-card animate-fade-in-up stagger-4">
              <h3 className="tracking-info-title">
                <Truck size={18} />
                Transporte
              </h3>
              <div className="tracking-info-list">
                <div className="tracking-info-item">
                  <span className="tracking-info-label">Motorista</span>
                  <span className="tracking-info-value">{delivery.driverName}</span>
                </div>
                <div className="tracking-info-item">
                  <span className="tracking-info-label">Placa</span>
                  <span className="tracking-info-value">{delivery.truckPlate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline de status */}
        <div className="tracking-timeline-card animate-fade-in-up stagger-5">
          <h3 className="tracking-info-title">
            <Clock size={18} />
            Histórico de Atualizações
          </h3>
          <div className="tracking-timeline">
            {history.map((entry, index) => {
              const entryStatus = DELIVERY_STATUS[entry.status];
              const EntryIcon = STATUS_ICONS[entry.status];
              return (
                <div 
                  key={entry.id} 
                  className={`timeline-item ${index === 0 ? 'timeline-item-current' : ''}`}
                >
                  <div className={`timeline-dot timeline-dot-${entryStatus.color}`}>
                    <EntryIcon size={14} />
                  </div>
                  <div className="timeline-line" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className={`timeline-status timeline-status-${entryStatus.color}`}>
                        {entryStatus.label}
                      </span>
                      <span className="timeline-date">{formatDateTime(entry.createdAt)}</span>
                    </div>
                    <p className="timeline-description">{entry.description}</p>
                    <span className="timeline-location">
                      <MapPin size={12} />
                      {entry.location}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
