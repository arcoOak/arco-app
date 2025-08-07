const API_HOST = import.meta.env.VITE_API_HOST;

const getAllNoticias = async (id_club) =>{
    try {
        const response = await fetch(`${API_HOST}/api/noticias/${id_club}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })

        if (!response.ok) throw new Error('Error al obtener las noticias');
        return response.json();

    } catch (error){
        console.error('Error al obtener todas las noticias:', error);
        throw error;
    }

}

const getNoticiaPorId = async (id_club, id_noticia) => {
    try {
        const response = await fetch(`${API_HOST}/api/noticias/${id_club}/${id_noticia}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });

        if (!response.ok) throw new Error('Error al obtener la noticia por ID');
        return response.json();

    } catch (error) {
        console.error('Error al obtener la noticia por ID:', error);
        throw error;
    }
}

const getUltimasNoticias = async (id_club) => {
    try{
        const response = await fetch(`${API_HOST}/api/noticias/${id_club}/ultima`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) throw new Error('Error al obtener la última noticia');
        return response.json();
    }catch(error){
        console.error('Error al obtener la última noticia:', error);
        throw error;
    }
}

const getNoticiasPorCategoria = async (id_club, id_categoria) => {
    try{
        const response = await fetch(`${API_HOST}/api/noticias/${id_club}/categoria/${id_categoria}`,{
            method:'GET',
            headers:{'Content-Type': 'application/json'}
        })

        if (!response.ok) throw new Error('Error al obtener noticias por categoría');
        return response.json();

    } catch (error){
        console.error('Error al obtener noticias por categoría:', error);
        throw error;
    }

}

const getNoticiasPorMesAnho = async (id_club, mes, anho ) =>{
    try{

        const response = await fetch(`${API_HOST}/api/noticias/${id_club}/mes/${mes}/anho/${anho}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) return [];
        return response.json();


    } catch(error){
        console.error('Error al obtener noticias por mes y año:', error);
        throw error;
    }
}

const getCategoriasNoticias = async (id_club) =>{
    try{

        const response = await fetch(`${API_HOST}/api/noticias/${id_club}/categoria/activas`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })

        if (!response.ok) throw new Error('Error al obtener categorías de noticias');
        return response.json();

    } catch (error) {
        console.error('Error al obtener categorías de noticias:', error);
        throw error;
    }
}

export default {
    getAllNoticias,
    getNoticiaPorId,
    getUltimasNoticias,
    getNoticiasPorCategoria,
    getNoticiasPorMesAnho,
    getCategoriasNoticias
}