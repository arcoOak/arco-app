// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

import LoadingModal from '../components/modals/LoadingModal';


// Contexto
export const AuthContext = createContext(null);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({id_socio : 1}); // Almacena los datos del usuario o null si no está autenticado
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando los datos iniciales

  useEffect(() => {
    // Aquí puedes intentar cargar los datos del usuario desde localStorage o una cookie
    // Cuando la aplicación se carga por primera vez
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    //setError(null);
    try {
      const userData = await authService.loginApi(username, password);
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (err) {
      //setError('Usuario o contraseña incorrectos');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser'); // Limpiar los datos persistidos
    // Aquí podrías notificar a tu API de backend que la sesión ha terminado
    // Redirigir al usuario a la página de login o inicio
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user, // Un booleano para saber si el usuario está autenticado
  };

  if (loading) {
    return <LoadingModal>Cargando sesión...</LoadingModal>; // O un spinner/componente de carga
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};