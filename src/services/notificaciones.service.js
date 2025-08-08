const API_HOST = import.meta.env.VITE_API_HOST;

const getAllNotificaciones = async (id_usuario) =>{
    try {
        const response = await fetch(`${API_HOST}/api/notificaciones/${id_usuario}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })

        if (!response.ok) throw new Error('Error al obtener las notificaciones');
        return response.json();

    } catch (error){
        console.error('Error al obtener todas las notificaciones:', error);
        throw error;
    }

}

const getNotificacionPorId = async (id_usuario, id_notificacion) => {
    try {
        const response = await fetch(`${API_HOST}/api/notificaciones/${id_usuario}/${id_notificacion}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });

        if (!response.ok) throw new Error('Error al obtener la notificacion por ID');
        return response.json();

    } catch (error) {
        console.error('Error al obtener la notificacion por ID:', error);
        throw error;
    }
}

const getUltimasNotificaciones = async (id_usuario) => {
    try{
        const response = await fetch(`${API_HOST}/api/notificaciones/${id_usuario}/ultima`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) throw new Error('Error al obtener la última notificacion');
        return response.json();
    }catch(error){
        console.error('Error al obtener la última notificacion:', error);
        throw error;
    }
}

const getNotificacionesPorCategoria = async (id_usuario, id_categoria) => {
    try{
        const response = await fetch(`${API_HOST}/api/notificaciones/${id_usuario}/categoria/${id_categoria}`,{
            method:'GET',
            headers:{'Content-Type': 'application/json'}
        })

        if (!response.ok) throw new Error('Error al obtener notificaciones por categoría');
        return response.json();

    } catch (error){
        console.error('Error al obtener notificaciones por categoría:', error);
        throw error;
    }

}

const getNotificacionesPorMesAnho = async (id_usuario, mes, anho ) =>{
    try{

        const response = await fetch(`${API_HOST}/api/notificaciones/${id_usuario}/mes/${mes}/anho/${anho}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) return [];
        return response.json();


    } catch(error){
        console.error('Error al obtener notificaciones por mes y año:', error);
        throw error;
    }
}

const getCategoriasNotificaciones = async (id_usuario) =>{
    try{

        const response = await fetch(`${API_HOST}/api/notificaciones/${id_usuario}/categoria/activas`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) throw new Error('Error al obtener categorías de notificaciones');
        return response.json();

    } catch (error) {
        console.error('Error al obtener categorías de notificaciones:', error);
        throw error;
    }
}

export default {
    getAllNotificaciones,
    getNotificacionPorId,
    getUltimasNotificaciones,
    getNotificacionesPorCategoria,
    getNotificacionesPorMesAnho,
    getCategoriasNotificaciones
}