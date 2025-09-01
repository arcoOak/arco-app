import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import notificacionesService from '../services/notificaciones.service';
import { useAuth } from './AuthContext';

export const NotificacionesContext = createContext(null);

export const NotificacionesProvider = ({ children }) => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [noVistasCount, setNoVistasCount] = useState(0);
    const { user } = useAuth();

    const fetchNotificacionesData = useCallback(async () => {
        if ( user?.id_usuario) {
            try {
                // No es necesario poner setLoading(true) aquí para evitar parpadeos en las actualizaciones automáticas
                const notificacionesRes = await notificacionesService.getAllNotificaciones(user.id_usuario);

                setNotificaciones(notificacionesRes);

                if(notificacionesRes && notificacionesRes.length > 0){
                    setNoVistasCount(notificacionesRes.filter(n => !n.estado_visualizacion).length);
                }else{
                    setNoVistasCount(0);
                }
                
            } catch (error) {
                console.error('Error al obtener notificaciones:', error);
            } 
        } else {
            // Limpiar estado si el usuario no está autenticado
            setNotificaciones([]);
            setNoVistasCount(0);
        }
    }, []);

    useEffect(() => {
        fetchNotificacionesData(); // Carga inicial
        const intervalId = setInterval(fetchNotificacionesData, 5 * 60 * 1000); // Actualiza cada 5 minutos
        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
    }, [fetchNotificacionesData]);

    const marcarComoVista = async (id_notificacion) => {
        try {
            await notificacionesService.marcarNotificacionComoVista(id_notificacion);
            // Vuelve a cargar las notificaciones para actualizar el estado y el contador
            await fetchNotificacionesData();
        } catch (error) {
            console.error('Error al marcar notificación como vista:', error);
        }
    };

    const value = {
        notificaciones,
        noVistasCount,
        marcarComoVista
    };

    return (
        <NotificacionesContext.Provider value={value}>
            {children}
        </NotificacionesContext.Provider>
    );
};

export const useNotificaciones = () => {
    const context = useContext(NotificacionesContext);
    if (!context) {
        throw new Error('useNotificaciones debe ser utilizado dentro de un NotificacionesProvider');
    }
    return context;
};
