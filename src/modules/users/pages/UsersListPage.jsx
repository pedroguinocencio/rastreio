/**
 * UsersListPage - rastre.io
 * Gerenciamento de usuários (apenas admin)
 * Lista com filtros, criação e edição
 */
import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, toggleUserActive } from '../services/userService';
import { USER_ROLES, PERMISSION_LABELS } from '../../../shared/utils/constants';
import { getInitials } from '../../../shared/utils/formatters';
import { Loading } from '../../../shared/components/Loading';
import { EmptyState } from '../../../shared/components/EmptyState';
import {
  Users, Search, Plus, Edit3, UserCheck, UserX,
  X, Shield, Mail, Phone, Truck, ChevronDown, ChevronUp
} from 'lucide-react';
import './users.css';

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [expandedPermissions, setExpandedPermissions] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', role: 'employee', truckPlate: ''
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const data = await getUsers({ search, role: roleFilter });
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [search, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers({ search, role: roleFilter });
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ name: '', email: '', password: '', phone: '', role: 'employee', truckPlate: '' });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone,
      role: user.role,
      truckPlate: user.truckPlate || ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || (!editingUser && !form.password)) {
      setFormError('Preencha todos os campos obrigatórios');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (editingUser) {
        await updateUser(editingUser.id, form);
      } else {
        await createUser(form);
      }
      await loadUsers();
      setShowModal(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await toggleUserActive(userId);
      await loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePermissions = (userId) => {
    setExpandedPermissions(expandedPermissions === userId ? null : userId);
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Usuários</h1>
          <p className="page-subtitle">Gerenciar usuários e permissões do sistema</p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} />
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="users-filters animate-fade-in">
        <div className="deliveries-search">
          <Search size={16} className="deliveries-search-icon" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>
        <select
          className="select-field"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ minWidth: '180px' }}
        >
          <option value="">Todos os perfis</option>
          {Object.entries(USER_ROLES).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {loading ? (
        <Loading />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum usuário encontrado"
          description="Crie um novo usuário para começar"
        />
      ) : (
        <div className="users-list animate-fade-in-up">
          {users.map(user => {
            const roleInfo = USER_ROLES[user.role];
            const isExpanded = expandedPermissions === user.id;
            return (
              <div key={user.id} className={`user-card ${!user.active ? 'user-card-inactive' : ''}`}>
                <div className="user-card-main">
                  <div className="user-card-avatar">
                    {getInitials(user.name)}
                  </div>
                  <div className="user-card-info">
                    <div className="user-card-name-row">
                      <span className="user-card-name">{user.name}</span>
                      {!user.active && (
                        <span className="badge badge-danger">Inativo</span>
                      )}
                    </div>
                    <span className="user-card-email">
                      <Mail size={12} /> {user.email}
                    </span>
                    <div className="user-card-meta">
                      <span className={`badge badge-${user.role === 'admin' ? 'primary' : user.role === 'employee' ? 'info' : 'warning'}`}>
                        <Shield size={10} /> {roleInfo.label}
                      </span>
                      {user.phone && (
                        <span className="user-card-phone">
                          <Phone size={12} /> {user.phone}
                        </span>
                      )}
                      {user.truckPlate && (
                        <span className="user-card-truck">
                          <Truck size={12} /> {user.truckPlate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="user-card-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => togglePermissions(user.id)}
                      title="Ver permissões"
                    >
                      <Shield size={14} />
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEditModal(user)}
                      title="Editar"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className={`btn btn-sm ${user.active ? 'btn-ghost' : 'btn-success'}`}
                      onClick={() => handleToggleActive(user.id)}
                      title={user.active ? 'Desativar' : 'Ativar'}
                    >
                      {user.active ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                  </div>
                </div>

                {/* Painel de permissões expansível */}
                {isExpanded && (
                  <div className="user-permissions animate-fade-in-down">
                    <h4>Permissões — {roleInfo.label}</h4>
                    <p className="user-permissions-desc">{roleInfo.description}</p>
                    <div className="permissions-grid">
                      {Object.entries(PERMISSION_LABELS).map(([perm, label]) => {
                        const hasIt = roleInfo.permissions.includes(perm);
                        return (
                          <div key={perm} className={`permission-item ${hasIt ? 'granted' : 'denied'}`}>
                            {hasIt ? <UserCheck size={12} /> : <X size={12} />}
                            <span>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de criação/edição */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="user-form">
              <div className="input-group">
                <label>Nome *</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div className="input-group">
                <label>Email *</label>
                <input
                  className="input-field"
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@locatrans.com"
                />
              </div>
              <div className="input-group">
                <label>{editingUser ? 'Nova Senha (deixe vazio para manter)' : 'Senha *'}</label>
                <input
                  className="input-field"
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="input-group">
                <label>Telefone</label>
                <input
                  className="input-field"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="input-group">
                <label>Perfil *</label>
                <select
                  className="select-field"
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                >
                  {Object.entries(USER_ROLES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label} — {val.description}</option>
                  ))}
                </select>
              </div>
              {form.role === 'driver' && (
                <div className="input-group">
                  <label>Placa do Caminhão</label>
                  <input
                    className="input-field"
                    value={form.truckPlate}
                    onChange={e => setForm({ ...form, truckPlate: e.target.value.toUpperCase() })}
                    placeholder="ABC-1D23"
                  />
                </div>
              )}

              {/* Prévia de permissões */}
              <div className="user-form-permissions">
                <h4>Permissões do perfil: {USER_ROLES[form.role].label}</h4>
                <div className="permissions-grid permissions-grid-sm">
                  {USER_ROLES[form.role].permissions.map(perm => (
                    <div key={perm} className="permission-item granted">
                      <UserCheck size={11} />
                      <span>{PERMISSION_LABELS[perm]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {formError && (
                <div className="login-error">{formError}</div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Salvando...' : (editingUser ? 'Salvar' : 'Criar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
