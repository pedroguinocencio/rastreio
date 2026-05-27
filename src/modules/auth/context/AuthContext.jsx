/**
 * Auth Context - rastre.io
 * Gerencia autenticação com Firebase Auth e perfis no Firestore
 * Usa Context API + useReducer para estado global de auth
 */
import { useReducer, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../shared/utils/firebase';
import { USER_ROLES } from '../../../shared/utils/constants';
import { AuthContext } from './AuthContextValue';

const DEFAULT_FIREBASE_ROLE = import.meta.env.VITE_FIREBASE_DEFAULT_ROLE || 'employee';

function getInitialState() {
  const saved = getSavedSession();
  return {
    user: saved,
    isAuthenticated: Boolean(saved),
    loading: true,
    error: null
  };
}

// Reducer de autenticação
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { user: action.payload, isAuthenticated: true, loading: false, error: null };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false, error: null };
    case 'AUTH_READY':
      return { ...state, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

function getFirebaseAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email ou senha inválidos';
    case 'auth/too-many-requests':
      return 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
    case 'auth/user-disabled':
      return 'Usuário desativado no Firebase Auth';
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Autenticação por email/senha não está habilitada no Firebase';
    case 'auth/network-request-failed':
      return 'Não foi possível conectar ao Firebase. Verifique sua conexão.';
    default:
      return 'Não foi possível autenticar com o Firebase';
  }
}

function getSafeUser(userData) {
  const safeUser = { ...userData };
  delete safeUser.password;
  return safeUser;
}

async function buildUserFromFirebase(firebaseUser) {
  const token = await firebaseUser.getIdTokenResult();
  const claimedRole = token.claims.role;
  const role = USER_ROLES[claimedRole] ? claimedRole : DEFAULT_FIREBASE_ROLE;

  return {
    id: firebaseUser.uid,
    authUid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
    email: firebaseUser.email,
    role: USER_ROLES[role] ? role : 'employee',
    phone: firebaseUser.phoneNumber || null,
    active: true
  };
}

function getSavedSession() {
  try {
    const saved = localStorage.getItem('rastre.io_auth');
    return saved ? JSON.parse(saved).user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, null, getInitialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        dispatch({ type: 'LOGOUT' });
        return;
      }

      try {
        const profile = await buildUserFromFirebase(firebaseUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: getSafeUser(profile) });
      } catch (error) {
        console.error('Erro ao montar usuário autenticado:', error);
        dispatch({ type: 'LOGIN_ERROR', payload: 'Não foi possível carregar o usuário autenticado' });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      localStorage.setItem('rastre.io_auth', JSON.stringify({ user: state.user }));
    } else if (!state.loading) {
      localStorage.removeItem('rastre.io_auth');
    }
  }, [state.isAuthenticated, state.loading, state.user]);

  /**
   * Tenta fazer login com Firebase Auth e carrega o perfil no Firestore.
   */
  const login = async (email, password) => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      let credential;
      try {
        credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      } catch (firebaseError) {
        dispatch({ type: 'LOGIN_ERROR', payload: getFirebaseAuthErrorMessage(firebaseError) });
        return false;
      }

      const profile = await buildUserFromFirebase(credential.user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: getSafeUser(profile) });
      return true;
    } catch (error) {
      console.error('Erro de login no Firebase:', error);
      dispatch({ type: 'LOGIN_ERROR', payload: 'Email ou senha inválidos' });
      return false;
    }
  };

  const logout = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
    localStorage.removeItem('rastre.io_auth');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  /**
   * Verifica se o usuário logado possui uma permissão específica
   */
  const hasPermission = (permission) => {
    if (!state.user) return false;
    const role = USER_ROLES[state.user.role];
    return role?.permissions.includes(permission) ?? false;
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    clearError,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
