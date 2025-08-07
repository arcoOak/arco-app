// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/auth.service';

import modificarSocio from '../services/modificar.service'; 
import clubService from '../services/club.service'; // Importa el servicio de club

import LoadingModal from '../components/modals/LoadingModal';

import billeteraService from '../services/billetera.service'; // Importa el servicio de billetera


// Contexto
export const AuthContext = createContext(null);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  //const [user, setUser] = useState(); // Almacena los datos del usuario o null si no está autenticado
  const [user, setUser] = useState(null); // Almacena los datos del usuario o null si no está autenticado
  const [clubInfo, setClubInfo] = useState(null); // Almacena la información del club
  //const [isAuthenticated, setIsAuthenticated] = useState(!!user); // Para saber si el usuario está autenticado
  const [loading, setLoading] = useState(true); // Para saber si estamos cargando los datos iniciales

  const [saldoBilletera, setSaldoBilletera] = useState(0); // Almacena el saldo de la billetera

  useEffect(() => {
    // Aquí puedes intentar cargar los datos del usuario desde localStorage o una cookie
    // Cuando la aplicación se carga por primera vez
    try{
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));

      //setIsAuthenticated(true); // Si hay un usuario almacenado, consideramos que está autenticado
    }} catch (error) {
      console.error('Error al cargar el usuario desde localStorage:', error);
      localStorage.removeItem('currentUser'); // Limpiar en caso de error
      setUser(null); // Asegurarse de que el usuario sea null en caso de error
    }finally{
      setLoading(false);
    }
  }, []);

  useEffect(() => {

    const obtenerSaldoBilletera = async () => {
      try {
        const response = await billeteraService.getBilletera(user.id_socio);
        const saldo = response.saldo_actual || 0; // Asegurarse de que el saldo sea un número
        setSaldoBilletera(saldo);
      } catch (error) {
        console.error('Error al obtener el saldo de la billetera:', error);
        setSaldoBilletera(0); // Establecer saldo a 0 en caso de error
      }
    };

    const obtenerDatosClub = async () =>{
      const clubData = await clubService.getDatosClub(user.id_club);
        setClubInfo(clubData);
    }

    if (user) {
      obtenerSaldoBilletera();
      obtenerDatosClub();
      
    }
  }, [user]);


  // useEffect(() => {
  //   // Actualizar el estado de autenticación cuando el usuario cambia
  //   setIsAuthenticated(!!user);
  //   //console.log('Estado de autenticación actualizado:', isAuthenticated);
  // }, [user]);

  const login = async (username, password) => {
    setLoading(true);
    //setError(null);
    try {
      //console.log('Intentando iniciar sesión con:', { username, password });
      const userData = await authService.loginApi(username, password);
      //console.log('Datos del usuario recibidos:', userData);

      if(userData.response === false) {
        //setError('Usuario o contraseña incorrectos');
        //setLoading(false);
        return false;
      }else{
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        //setIsAuthenticated(true); // Actualizar el estado de autenticación
        
        return true;
      }

    } catch (err) {
        console.error("Error en el login:", err);
        return false;

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    //setIsAuthenticated(false);
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
    try {
      const updatedFields = await modificarSocio.modificarSocioData(datosAEditar, newUserData.id_socio);
      if (updatedFields) {
        // Tratar el estado como inmutable: crear un nuevo objeto en lugar de mutar el existente
        const updatedUserData = { ...user, ...updatedFields };
        setUser(updatedUserData);
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
        return true; // Indicar que la edición fue exitosa
      }
      return false; // Indicar que la edición falló
    } catch (err) {
      console.error("Error al editar el usuario:", err);
      return false;
    } finally {
      setLoading(false);
    }

    //return false; // Indicar que la edición falló
  
    //setLoading(false);
    
  }

  // isAuthenticated es un valor derivado del estado 'user'.
  // No necesita su propio estado con useState y useEffect.
  const isAuthenticated = !!user;
  const value = {
    user,
    clubInfo, // Información del club
    saldoBilletera,
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