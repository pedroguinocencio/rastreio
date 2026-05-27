/**
 * LoginPage - rastre.io
 * Página de login para usuários internos
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { LoadingInline } from '../../../shared/components/Loading';
import './login.css';

export default function LoginPage() {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="login-card animate-scale-in">
      <div className="login-header">
        <h2>Área Interna</h2>
        <p>Faça login para acessar o painel</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <div className="login-input-wrapper">
            <Mail size={16} className="login-input-icon" />
            <input
              id="email"
              type="email"
              className="input-field login-input"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <div className="login-input-wrapper">
            <Lock size={16} className="login-input-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="input-field login-input"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-toggle-pass"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="login-error animate-fade-in-down">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary btn-lg login-submit"
          disabled={loading || !email || !password}
          id="login-submit"
        >
          {loading ? <LoadingInline /> : <LogIn size={18} />}
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Credenciais de teste */}
      <div className="login-demo">
        <span className="login-demo-label">Contas de teste:</span>
        <div className="login-demo-accounts">
          <button 
            className="login-demo-account"
            onClick={() => { setEmail('carlos@locatrans.com'); setPassword('admin123'); clearError(); }}
          >
            <strong>Admin</strong>
            <span>carlos@locatrans.com</span>
          </button>
          <button 
            className="login-demo-account"
            onClick={() => { setEmail('maria@locatrans.com'); setPassword('func123'); clearError(); }}
          >
            <strong>Funcionário</strong>
            <span>maria@locatrans.com</span>
          </button>
          <button 
            className="login-demo-account"
            onClick={() => { setEmail('jose@locatrans.com'); setPassword('motor123'); clearError(); }}
          >
            <strong>Motorista</strong>
            <span>jose@locatrans.com</span>
          </button>
        </div>
      </div>
    </div>
  );
}
