/**
 * FleetMapPage - rastre.io
 * Mapa da frota com marcadores dos caminhões e painel lateral
 * Usa Leaflet + OpenStreetMap (gratuito, sem API key)
 */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getFleetLocations } from '../../locations/services/locationService';
import { formatRelativeTime } from '../../../shared/utils/formatters';
import { Loading } from '../../../shared/components/Loading';
import { 
  Truck, MapPin, Gauge, Clock,
  ChevronRight, Signal, SignalZero, Package 
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './fleet.css';

// Ícone customizado para o marker do caminhão
const createTruckIcon = (isOnline) => {
  return L.divIcon({
    className: 'truck-marker-icon',
    html: `<div class="truck-marker ${isOnline ? 'truck-marker-online' : 'truck-marker-offline'}">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
        <path d="M15 18H9"/>
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
        <circle cx="17" cy="18" r="2"/>
        <circle cx="7" cy="18" r="2"/>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

// Componente para centralizar mapa numa localização
function FlyToLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1 });
    }
  }, [center, map]);
  return null;
}

export default function FleetMapPage() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [flyTo, setFlyTo] = useState(null);

  // Centro do Brasil como posição inicial
  const defaultCenter = [-23.55, -46.63];
  const defaultZoom = 6;

  useEffect(() => {
    async function loadFleet() {
      try {
        const data = await getFleetLocations();
        setTrucks(data);
      } catch (err) {
        console.error('Erro ao carregar frota:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFleet();
  }, []);

  const handleSelectTruck = (truck) => {
    setSelectedTruck(truck);
    setFlyTo([truck.latitude, truck.longitude]);
  };

  if (loading) return <Loading message="Carregando frota..." />;

  const onlineTrucks = trucks.filter(t => t.isOnline);
  const offlineTrucks = trucks.filter(t => !t.isOnline);

  return (
    <div className="fleet-page">
      <div className="fleet-content">
        {/* Painel lateral */}
        <div className="fleet-panel animate-slide-in-left">
          <div className="fleet-panel-header">
            <h2 className="fleet-panel-title">
              <Truck size={20} />
              Frota
            </h2>
            <div className="fleet-panel-stats">
              <span className="fleet-panel-stat">
                <span className="dot dot-success dot-pulse" />
                {onlineTrucks.length} online
              </span>
              <span className="fleet-panel-stat">
                <span className="dot dot-neutral" />
                {offlineTrucks.length} offline
              </span>
            </div>
          </div>

          <div className="fleet-panel-list">
            {trucks.map(truck => (
              <button
                key={truck.id}
                className={`fleet-panel-item ${selectedTruck?.id === truck.id ? 'fleet-panel-item-active' : ''}`}
                onClick={() => handleSelectTruck(truck)}
              >
                <div className={`fleet-panel-item-status ${truck.isOnline ? 'online' : 'offline'}`} />
                <div className="fleet-panel-item-info">
                  <span className="fleet-panel-item-plate">{truck.truckPlate}</span>
                  <span className="fleet-panel-item-driver">{truck.driverName || 'Sem motorista'}</span>
                  <span className="fleet-panel-item-city">
                    <MapPin size={10} /> {truck.currentCity}
                  </span>
                </div>
                <div className="fleet-panel-item-meta">
                  {truck.isOnline && truck.speed > 0 && (
                    <span className="fleet-speed">
                      <Gauge size={12} /> {truck.speed} km/h
                    </span>
                  )}
                  <span className="fleet-panel-item-packages">
                    <Package size={12} /> {truck.deliveriesCount}
                  </span>
                </div>
                <ChevronRight size={14} className="fleet-panel-item-arrow" />
              </button>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="fleet-map-container">
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            className="fleet-map"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {flyTo && <FlyToLocation center={flyTo} />}
            {trucks.map(truck => (
              <Marker
                key={truck.id}
                position={[truck.latitude, truck.longitude]}
                icon={createTruckIcon(truck.isOnline)}
                eventHandlers={{
                  click: () => setSelectedTruck(truck)
                }}
              >
                <Popup className="truck-popup">
                  <div className="truck-popup-content">
                    <h4>{truck.truckPlate}</h4>
                    <p>{truck.driverName || 'Sem motorista'}</p>
                    <p className="truck-popup-city">
                      <MapPin size={12} /> {truck.currentCity}
                    </p>
                    {truck.isOnline && (
                      <p className="truck-popup-speed">
                        <Gauge size={12} /> {truck.speed} km/h
                      </p>
                    )}
                    <p className="truck-popup-time">
                      <Clock size={12} /> {formatRelativeTime(truck.timestamp)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Info panel overlay quando truck selecionado */}
          {selectedTruck && (
            <div className="fleet-info-overlay animate-fade-in-up">
              <div className="fleet-info-card">
                <div className="fleet-info-header">
                  <div className={`fleet-info-status ${selectedTruck.isOnline ? 'online' : 'offline'}`}>
                    {selectedTruck.isOnline ? <Signal size={14} /> : <SignalZero size={14} />}
                    {selectedTruck.isOnline ? 'Online' : 'Offline'}
                  </div>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelectedTruck(null)}>
                    ×
                  </button>
                </div>
                <h3 className="fleet-info-plate">{selectedTruck.truckPlate}</h3>
                <p className="fleet-info-driver">{selectedTruck.driverName || 'Sem motorista'}</p>
                <div className="fleet-info-details">
                  <div><MapPin size={14} /> {selectedTruck.currentCity}</div>
                  {selectedTruck.isOnline && <div><Gauge size={14} /> {selectedTruck.speed} km/h</div>}
                  <div><Package size={14} /> {selectedTruck.deliveriesCount} entregas</div>
                  <div><Clock size={14} /> {formatRelativeTime(selectedTruck.timestamp)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
