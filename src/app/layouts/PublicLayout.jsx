/**
 * PublicLayout - rastre.io
 * Layout para páginas públicas (rastreamento)
 * Fundo claro com identidade visual da marca
 */
import { Outlet, Link } from 'react-router-dom';
import logo from '../../assets/rastreio-logo.webp';
import './layouts.css';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      {/* Background decorativo */}
      <div className="public-bg">
        <div className="public-bg-orb public-bg-orb-1" />
        <div className="public-bg-orb public-bg-orb-2" />
        <div className="public-bg-orb public-bg-orb-3" />
      </div>

      {/* Header simples */}
      <header className="public-header">
        <Link to="/" className="public-logo-link">
          <img src={logo} alt="rastre.io" className="public-logo" />
        </Link>
        <Link to="/login" className="btn btn-ghost btn-sm public-login-link">
          Área Interna
        </Link>
      </header>

      {/* Conteúdo */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <p>© 2026 rastre.io — Fatec Mogi das Cruzes</p>
      </footer>
    </div>
  );
}
