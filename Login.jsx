import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import '../styles/Login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simular validação
    setTimeout(() => {
      if (username === 'BUSTER' && password === '1234') {
        onLogin({ username, password });
      } else {
        setError('Usuário ou senha inválidos');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-card fade-in">
        <div className="login-logo">
          <img src="/logo.png" alt="BUSTER" />
        </div>

        <h1 className="login-title">Análise de Desempenho</h1>
        <p className="login-subtitle">BUSTER - Sistema de Gerenciamento Operacional</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <User size={18} />
              Usuário
            </label>
            <input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="form-input"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock size={18} />
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="form-input"
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Desenvolvido por <strong>Jean Viana</strong></p>
        </div>
      </div>
    </div>
  );
}
