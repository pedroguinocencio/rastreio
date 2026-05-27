/**
 * DashboardPage - rastre.io
 * Dashboard principal com métricas, gráficos e visão geral
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getDashboardStats, getDeliveries } from '../../deliveries/services/deliveryService';
import { getFleetLocations } from '../../locations/services/locationService';
import { DELIVERY_STATUS } from '../../../shared/utils/constants';
import { formatRelativeTime } from '../../../shared/utils/formatters';
import { Loading } from '../../../shared/components/Loading';
import {
  Package, Truck, CheckCircle2, Clock,
  TrendingUp, MapPin, ArrowRight
} from 'lucide-react';
import './dashboard.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsData, deliveriesData, fleetData] = await Promise.all([
          getDashboardStats(),
          getDeliveries(),
          getFleetLocations()
        ]);
        setStats(statsData);
        setRecentDeliveries(deliveriesData.slice(0, 5));
        setFleet(fleetData);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <Loading message="Carregando dashboard..." />;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle">
            Aqui está o resumo das operações de hoje
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card animate-fade-in-up stagger-1">
          <div className="stat-icon stat-icon-primary">
            <Package size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.total || 0}</span>
            <span className="stat-label">Total de Entregas</span>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up stagger-2">
          <div className="stat-icon stat-icon-warning">
            <Truck size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.inTransit || 0}</span>
            <span className="stat-label">Em Trânsito</span>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up stagger-3">
          <div className="stat-icon stat-icon-success">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.delivered || 0}</span>
            <span className="stat-label">Entregues</span>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up stagger-4">
          <div className="stat-icon stat-icon-neutral">
            <Clock size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats?.pending || 0}</span>
            <span className="stat-label">Pendentes</span>
          </div>
        </div>
      </div>

      {/* Delivery Rate + Fleet Overview */}
      <div className="dashboard-grid">
        {/* Taxa de Entrega */}
        <div className="card animate-fade-in-up stagger-3">
          <div className="card-header">
            <h3 className="card-title">Taxa de Entrega</h3>
            <TrendingUp size={18} className="text-success" />
          </div>
          <div className="delivery-rate">
            <div className="delivery-rate-circle">
              <svg viewBox="0 0 120 120" className="delivery-rate-svg">
                <circle cx="60" cy="60" r="52" className="delivery-rate-bg" />
                <circle
                  cx="60" cy="60" r="52"
                  className="delivery-rate-fill"
                  strokeDasharray={`${(stats?.deliveryRate || 0) * 3.267} 326.7`}
                  strokeDashoffset="0"
                />
              </svg>
              <span className="delivery-rate-value">{stats?.deliveryRate || 0}%</span>
            </div>
            <div className="delivery-rate-legend">
              <div className="delivery-rate-item">
                <span className="dot dot-success" />
                <span>Entregues: {stats?.delivered || 0}</span>
              </div>
              <div className="delivery-rate-item">
                <span className="dot dot-warning" />
                <span>Em trânsito: {stats?.inTransit || 0}</span>
              </div>
              <div className="delivery-rate-item">
                <span className="dot dot-neutral" />
                <span>Pendentes: {stats?.pending || 0}</span>
              </div>
              <div className="delivery-rate-item">
                <span className="dot dot-danger" />
                <span>Devolvidos: {stats?.returned || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status por tipo - visual chart */}
        <div className="card animate-fade-in-up stagger-4">
          <div className="card-header">
            <h3 className="card-title">Entregas por Status</h3>
          </div>
          <div className="status-bars">
            {Object.entries({
              pending: { label: 'Pendente', count: stats?.pending || 0, color: 'var(--text-muted)' },
              collected: { label: 'Coletado', count: stats?.collected || 0, color: 'var(--info)' },
              in_transit: { label: 'Em Trânsito', count: stats?.inTransit || 0, color: 'var(--warning)' },
              out_for_delivery: { label: 'Saiu p/ Entrega', count: stats?.outForDelivery || 0, color: 'var(--primary)' },
              delivered: { label: 'Entregue', count: stats?.delivered || 0, color: 'var(--success)' },
              returned: { label: 'Devolvido', count: stats?.returned || 0, color: 'var(--danger)' },
            }).map(([key, item]) => (
              <div key={key} className="status-bar-item">
                <div className="status-bar-header">
                  <span className="status-bar-label">{item.label}</span>
                  <span className="status-bar-count">{item.count}</span>
                </div>
                <div className="status-bar-track">
                  <div
                    className="status-bar-fill"
                    style={{
                      width: `${stats?.total ? (item.count / stats.total) * 100 : 0}%`,
                      background: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="dashboard-grid">
        {/* Entregas Recentes */}
        <div className="card animate-fade-in-up stagger-5">
          <div className="card-header">
            <h3 className="card-title">Entregas Recentes</h3>
            <Link to="/app/entregas" className="btn btn-ghost btn-sm">
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="recent-deliveries">
            {recentDeliveries.map(delivery => {
              const statusInfo = DELIVERY_STATUS[delivery.status];
              return (
                <Link
                  key={delivery.id}
                  to={`/app/entregas/${delivery.id}`}
                  className="recent-delivery-item"
                >
                  <div className="recent-delivery-info">
                    <span className="recent-delivery-code">{delivery.trackingCode}</span>
                    <span className="recent-delivery-recipient">{delivery.recipientName}</span>
                  </div>
                  <div className="recent-delivery-meta">
                    <span className={`badge badge-${statusInfo.color} badge-dot`}>
                      {statusInfo.label}
                    </span>
                    <span className="recent-delivery-time">
                      {formatRelativeTime(delivery.updatedAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Visão da Frota */}
        <div className="card animate-fade-in-up stagger-6">
          <div className="card-header">
            <h3 className="card-title">Frota</h3>
            <Link to="/app/frota" className="btn btn-ghost btn-sm">
              Ver mapa <ArrowRight size={14} />
            </Link>
          </div>
          <div className="fleet-summary">
            <div className="fleet-stat">
              <span className="fleet-stat-value">{stats?.trucksOnline || 0}</span>
              <span className="fleet-stat-label">Online</span>
              <span className="dot dot-success dot-pulse" />
            </div>
            <div className="fleet-stat">
              <span className="fleet-stat-value">{stats?.trucksTotal || 0}</span>
              <span className="fleet-stat-label">Total</span>
            </div>
          </div>
          <div className="fleet-list">
            {fleet.map(truck => (
              <div key={truck.id} className="fleet-item">
                <div className={`fleet-item-status ${truck.isOnline ? 'online' : 'offline'}`} />
                <div className="fleet-item-info">
                  <span className="fleet-item-plate">{truck.truckPlate}</span>
                  <span className="fleet-item-driver">{truck.driverName || 'Sem motorista'}</span>
                </div>
                <div className="fleet-item-location">
                  <MapPin size={12} />
                  <span>{truck.currentCity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
