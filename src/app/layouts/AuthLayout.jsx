/**
 * AuthLayout - rastre.io
 * Layout para tela de login
 * Dark mode com foco no formulário central
 */
import { Outlet, Link } from 'react-router-dom';
import logo from '../../assets/rastreio-logo.webp';
import './layouts.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      {/* Background decorativo */}
      <div className="auth-bg">
        <div className="auth-bg-gradient" />
      </div>

      <div className="auth-container">
        <Link to="/" className="auth-logo-link">
          <img src={logo} alt="rastre.io" className="auth-logo" />
        </Link>
        <Outlet />
        <Link to="/" className="auth-back-link">
          ← Voltar para rastreamento
        </Link>
      </div>
    </div>
  );
}
