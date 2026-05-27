/**
 * ScannerPage - rastre.io
 * Simulação de scanner QR para atualizar status de encomendas
 * Em produção, integraria com câmera real. Aqui simula via input.
 */
import { useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { getDeliveryByTrackingCode, updateDeliveryStatus } from '../../deliveries/services/deliveryService';
import { DELIVERY_STATUS } from '../../../shared/utils/constants';
import { validateTrackingCode } from '../../tracking/services/trackingService';
import { QRCodeSVG } from 'qrcode.react';
import {
  ScanLine, Search, CheckCircle2,
  Camera, Keyboard
} from 'lucide-react';
import './scanner.css';

export default function ScannerPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState('scan'); // 'scan' | 'result' | 'update'
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess(false);

    const validation = validateTrackingCode(code);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    try {
      const result = await getDeliveryByTrackingCode(validation.code);
      setDelivery(result);
      setMode('result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || !description) return;
    setLoading(true);
    try {
      await updateDeliveryStatus(delivery.id, newStatus, description, user);
      setSuccess(true);
      setMode('scan');
      setDelivery(null);
      setCode('');
      setNewStatus('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setMode('scan');
    setCode('');
    setError('');
    setDelivery(null);
    setNewStatus('');
    setDescription('');
    setSuccess(false);
  };

  return (
    <div className="scanner-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Scanner QR</h1>
          <p className="page-subtitle">Escaneie ou insira o código da encomenda para atualizar o status</p>
        </div>
      </div>

      <div className="scanner-container">
        {/* Feedback de sucesso */}
        {success && (
          <div className="scanner-success animate-scale-in">
            <CheckCircle2 size={48} />
            <h3>Status atualizado com sucesso!</h3>
            <p>A encomenda foi atualizada no sistema.</p>
            <button className="btn btn-primary" onClick={resetScanner}>
              <ScanLine size={16} />
              Nova leitura
            </button>
          </div>
        )}

        {/* Modo Scanner / Input */}
        {mode === 'scan' && !success && (
          <div className="scanner-input-area animate-fade-in-up">
            {/* Simulação visual de scanner */}
            <div className="scanner-visual">
              <div className="scanner-frame">
                <div className="scanner-corners" />
                <div className="scanner-line" />
                <Camera size={32} className="scanner-camera-icon" />
              </div>
              <p className="scanner-visual-text">
                Simulação de câmera — insira o código manualmente
              </p>
            </div>

            {/* Input manual */}
            <form onSubmit={handleSearch} className="scanner-form">
              <div className="scanner-input-wrapper">
                <Keyboard size={18} className="scanner-input-icon" />
                <input
                  type="text"
                  className="input-field scanner-code-input"
                  placeholder="Insira o código de rastreio"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                  maxLength={12}
                  autoFocus
                  id="scanner-code-input"
                />
                <button type="submit" className="btn btn-primary" disabled={loading || !code}>
                  <Search size={16} />
                  Buscar
                </button>
              </div>
              {error && <p className="scanner-error">{error}</p>}
            </form>

            {/* Códigos de teste */}
            <div className="scanner-test-codes">
              <span>Testar com:</span>
              {['LCT2025B042', 'LCT2025C107', 'LCT2025D055'].map(c => (
                <button key={c} className="scanner-test-code" onClick={() => setCode(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultado - Encomenda encontrada */}
        {mode === 'result' && delivery && (
          <div className="scanner-result animate-scale-in">
            <div className="scanner-result-header">
              <div className="scanner-qr">
                <QRCodeSVG
                  value={delivery.trackingCode}
                  size={100}
                  bgColor="transparent"
                  fgColor="var(--primary-light)"
                  level="M"
                />
              </div>
              <div className="scanner-result-info">
                <span className="scanner-result-code">{delivery.trackingCode}</span>
                <span className="scanner-result-desc">{delivery.description}</span>
                <span className={`badge badge-${DELIVERY_STATUS[delivery.status].color} badge-dot`}>
                  {DELIVERY_STATUS[delivery.status].label}
                </span>
              </div>
            </div>

            <div className="scanner-result-details">
              <div className="scanner-detail-row">
                <span>Destinatário</span>
                <span>{delivery.recipientName}</span>
              </div>
              <div className="scanner-detail-row">
                <span>Endereço</span>
                <span>{delivery.recipientAddress}</span>
              </div>
            </div>

            {/* Formulário de atualização */}
            {delivery.status !== 'delivered' && delivery.status !== 'returned' ? (
              <div className="scanner-update-form">
                <h3>Atualizar Status</h3>
                <div className="input-group">
                  <label>Novo Status</label>
                  <select
                    className="select-field"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Selecione o status...</option>
                    {Object.entries(DELIVERY_STATUS)
                      .filter(([key]) => key !== 'pending')
                      .map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Observação</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Descreva a atualização..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div className="scanner-update-actions">
                  <button className="btn btn-secondary" onClick={resetScanner}>
                    Cancelar
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleUpdateStatus}
                    disabled={!newStatus || !description || loading}
                  >
                    <CheckCircle2 size={16} />
                    {loading ? 'Atualizando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="scanner-completed">
                <p>Esta encomenda já foi {delivery.status === 'delivered' ? 'entregue' : 'devolvida'}.</p>
                <button className="btn btn-primary" onClick={resetScanner}>
                  Nova leitura
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
