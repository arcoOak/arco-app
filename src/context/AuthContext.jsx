// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

import modificarSocio from '../services/modificar.service'; 

import LoadingModal from '../components/modals/LoadingModal';


// Contexto
export const AuthContext = createContext(null);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  //const [user, setUser] = useState(); // Almacena los datos del usuario o null si no está autenticado
  //const [isAuthenticated, setIsAuthenticated] = useState(!!user); // Para saber si el usuario está autenticado
  const [user, setUser] = useState(null); // Almacena los datos del usuario o null si no está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Para saber si el usuario está autenticado
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando los datos iniciales

  useEffect(() => {
    // Aquí puedes intentar cargar los datos del usuario desde localStorage o una cookie
    // Cuando la aplicación se carga por primera vez
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true); // Si hay un usuario almacenado, consideramos que está autenticado
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    //setError(null);
    try {
      //console.log('Intentando iniciar sesión con:', { username, password });
      const userData = await authService.loginApi(username, password);
      //console.log('Datos del usuario recibidos:', userData);

      if(userData.response === false) {
        //setError('Usuario o contraseña incorrectos');
        setLoading(false);
        return false;
      }else{
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setIsAuthenticated(true); // Actualizar el estado de autenticación
        setLoading(false);
        return true;
      }

    } catch (err) {
      //setError('Usuario o contraseña incorrectos');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser'); // Limpiar los datos persistidos
    // Aquí podrías notificar a tu API de backend que la sesión ha terminado
    // Redirigir al usuario a la página de login o inicio
  };

  const editarUsuario = async (newUserData) => {
    setLoading(true);
    const datosAEditar = {
      nombre: newUserData.nombre,
      apellido: newUserData.apellido,
      documento_identidad: newUserData.documento_identidad,
      fecha_nacimiento: newUserData.fecha_nacimiento,
      telefono: newUserData.telefono,
      direccion: newUserData.direccion,
      id_genero: newUserData.id_genero
    }
    //console.log('Datos del usuario a editar:', datosAEditar);
    const updatedUser = await modificarSocio.modificarSocioData(datosAEditar, newUserData.id_socio);
    //console.log('Datos del usuario actualizados:', updatedUser);
    if(updatedUser !== null && updatedUser !== undefined ) {
      //console.log('Datos del usuario actualizados:', updatedUser);

      const userData = user;
      
      Object.entries(updatedUser).forEach( ([key, value]) => {
        userData[key] = value; // Actualizar los datos del usuario
      });

      //console.log('Datos del usuario actualizados en el estado:', userData);
      setUser(userData); // Actualizar el estado del usuario

      localStorage.setItem('currentUser', JSON.stringify(userData)); // Actualizar los datos
      setLoading(false); // Finalizar el estado de carga
      return true; // Indicar que la edición fue exitosa
    }

    return false; // Indicar que la edición falló
  
    //setLoading(false);
    
  }

  const value = {
    user,
    loading,
    login,
    logout,
    editarUsuario,
    isAuthenticated, // Un booleano para saber si el usuario está autenticado
  };

  // if (loading) {
  //   return <LoadingModal>Cargando sesión...</LoadingModal>; // O un spinner/componente de carga
  // }

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