

const API_HOST = import.meta.env.VITE_API_HOST;

const getAllNotificaciones = async (id_usuario) => {
    const response = await fetch(`${API_HOST}/api/notificaciones/${id_usuario}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    return response.json();
};

const marcarNotificacionComoVista = async (id_notificacion) => {
    const response = await fetch(`${API_HOST}/api/notificaciones/visualizar/${id_notificacion}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
};

const crearNotificacion = async (dataNotificacion) => {
    const response = await fetch(`${API_HOST}/api/notificaciones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataNotificacion)
    });
    return response.json();
};

export default {
    marcarNotificacionComoVista,
    crearNotificacion,
    getAllNotificaciones
};
