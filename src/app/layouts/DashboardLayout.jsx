/**
 * DashboardLayout - rastre.io
 * Layout principal para área interna (dashboard)
 * Sidebar + Header + Content area
 * Responsivo: sidebar colapsa em mobile
 */
import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { SIDEBAR_ITEMS } from '../../shared/utils/constants';
import { getInitials } from '../../shared/utils/formatters';
import { 
  LayoutDashboard, Package, Map, ScanLine, Users,
  LogOut, Menu, X
} from 'lucide-react';
import logo from '../../assets/rastreio-logo.webp';
import './layouts.css';

// Mapeamento de nomes de ícones para componentes
const ICON_MAP = {
  LayoutDashboard, Package, Map, ScanLine, Users
};

export default function DashboardLayout() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filtra itens do menu baseado nas permissões do usuário
  const menuItems = SIDEBAR_ITEMS.filter(item => hasPermission(item.permission));

  return (
    <div className="dashboard-layout">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/app/dashboard" className="sidebar-logo-link">
            <img src={logo} alt="rastre.io" className="sidebar-logo" />
          </Link>
          <button 
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = ICON_MAP[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {Icon && <Icon size={20} />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.name}</span>
              <span className="sidebar-user-role">
                {user?.role === 'admin' ? 'Administrador' : 
                 user?.role === 'employee' ? 'Funcionário' : 'Motorista'}
              </span>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="dashboard-content">
        {/* Header mobile */}
        <header className="dashboard-header">
          <button 
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <Link to="/app/dashboard" className="dashboard-header-logo">
            <img src={logo} alt="rastre.io" className="dashboard-header-logo-img" />
          </Link>
          <div className="dashboard-header-user">
            <div className="sidebar-user-avatar sidebar-user-avatar-sm">
              {getInitials(user?.name)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
