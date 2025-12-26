import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se já está logado
    const logged = localStorage.getItem('buster_logged_in');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (credentials) => {
    localStorage.setItem('buster_logged_in', 'true');
    localStorage.setItem('buster_user', credentials.username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('buster_logged_in');
    localStorage.removeItem('buster_user');
    setIsLoggedIn(false);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return isLoggedIn ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
