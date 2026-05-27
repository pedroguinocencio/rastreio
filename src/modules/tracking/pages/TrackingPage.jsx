/**
 * TrackingPage - rastre.io
 * Página pública principal de rastreamento
 * Hero com campo de busca centralizado
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, Truck, MapPin, Clock } from 'lucide-react';
import { validateTrackingCode } from '../services/trackingService';
import './tracking.css';

export default function TrackingPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const validation = validateTrackingCode(code);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    navigate(`/rastreio/${validation.code}`);
  };

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (error) setError('');
  };

  return (
    <div className="tracking-page">
      <div className="tracking-hero">
        <div className="tracking-hero-content animate-fade-in-up">
          <h1 className="tracking-title">
            Rastreie sua <span className="tracking-title-highlight">encomenda</span>
          </h1>
          <p className="tracking-subtitle">
            Insira o código de rastreio para acompanhar o status da sua entrega em tempo real
          </p>

          <form className="tracking-form" onSubmit={handleSubmit}>
            <div className="tracking-input-wrapper">
              <Search className="tracking-input-icon" size={20} />
              <input
                type="text"
                className={`tracking-input ${error ? 'tracking-input-error' : ''}`}
                placeholder="Ex: LCT2025A001"
                value={code}
                onChange={handleChange}
                maxLength={12}
                autoFocus
                id="tracking-code-input"
              />
              <button type="submit" className="tracking-submit-btn" id="tracking-submit">
                Rastrear
              </button>
            </div>
            {error && (
              <p className="tracking-error animate-fade-in-down">{error}</p>
            )}
          </form>

          {/* Códigos de exemplo para facilitar teste */}
          <div className="tracking-examples">
            <span className="tracking-examples-label">Teste com:</span>
            {['LCT2025A001', 'LCT2025B042', 'LCT2025C107'].map(c => (
              <button 
                key={c} 
                className="tracking-example-code"
                onClick={() => { setCode(c); navigate(`/rastreio/${c}`); }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="tracking-features animate-fade-in-up stagger-3">
          <div className="tracking-feature">
            <div className="tracking-feature-icon">
              <Package size={24} />
            </div>
            <h3>Rastreamento Fácil</h3>
            <p>Acompanhe sua encomenda em poucos cliques</p>
          </div>
          <div className="tracking-feature">
            <div className="tracking-feature-icon">
              <Truck size={24} />
            </div>
            <h3>Frota Monitorada</h3>
            <p>Veículos rastreados em tempo real</p>
          </div>
          <div className="tracking-feature">
            <div className="tracking-feature-icon">
              <MapPin size={24} />
            </div>
            <h3>Localização Precisa</h3>
            <p>Saiba exatamente onde sua entrega está</p>
          </div>
          <div className="tracking-feature">
            <div className="tracking-feature-icon">
              <Clock size={24} />
            </div>
            <h3>Atualizações em Tempo Real</h3>
            <p>Status atualizado a cada etapa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
