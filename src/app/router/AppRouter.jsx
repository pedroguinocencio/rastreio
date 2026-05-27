/**
 * AppRouter - rastre.io
 * Configuração central de rotas do sistema
 * Inclui rotas públicas, de autenticação e protegidas
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { Loading } from '../../shared/components/Loading';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Páginas públicas
import TrackingPage from '../../modules/tracking/pages/TrackingPage';
import TrackingResultPage from '../../modules/tracking/pages/TrackingResultPage';

// Autenticação
import LoginPage from '../../modules/auth/pages/LoginPage';

// Páginas internas
import DashboardPage from '../../modules/dashboard/pages/DashboardPage';
import DeliveriesListPage from '../../modules/deliveries/pages/DeliveriesListPage';
import DeliveryDetailPage from '../../modules/deliveries/pages/DeliveryDetailPage';
import FleetMapPage from '../../modules/locations/pages/FleetMapPage';
import ScannerPage from '../../modules/scanner/pages/ScannerPage';

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para /login se não autenticado
 * Opcionalmente verifica permissão específica
 */
function ProtectedRoute({ children, permission }) {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  if (loading) {
    return <Loading message="Validando sessão..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}

/**
 * Rota que redireciona para dashboard se já autenticado
 */
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <Loading message="Validando sessão..." />;
  }
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---- Rotas Públicas ---- */}
        <Route element={<PublicLayout />}>
          <Route index element={<TrackingPage />} />
          <Route path="rastreio/:code" element={<TrackingResultPage />} />
        </Route>

        {/* ---- Rotas de Autenticação ---- */}
        <Route element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }>
          <Route path="login" element={<LoginPage />} />
        </Route>

        {/* ---- Rotas Protegidas (Dashboard) ---- */}
        <Route path="app" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="entregas" element={
            <ProtectedRoute permission="deliveries.view">
              <DeliveriesListPage />
            </ProtectedRoute>
          } />
          <Route path="entregas/:id" element={
            <ProtectedRoute permission="deliveries.view">
              <DeliveryDetailPage />
            </ProtectedRoute>
          } />
          <Route path="frota" element={
            <ProtectedRoute permission="fleet.view">
              <FleetMapPage />
            </ProtectedRoute>
          } />
          <Route path="scanner" element={
            <ProtectedRoute permission="scanner.use">
              <ScannerPage />
            </ProtectedRoute>
          } />
        </Route>

        {/* ---- Catch-all: redireciona para home ---- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
