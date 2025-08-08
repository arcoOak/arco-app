import {
    getAllNotificacionesDB,
    getNoticiaPorIdDB,
    getUltimasNotificacionesDB,
    getNotificacionesPorCategoriaDB,
    getNotificacionesPorMesAnhoDB,
    getCategoriasNotificacionesDB
} from '../models/Notificaciones.model.js';


const getAllNotificaciones = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const Notificaciones = await getAllNotificacionesDB(id_usuario);
        if (!Notificaciones || Notificaciones.length === 0) {
            return res.status(404).json({ message: 'No hay Notificaciones disponibles' });
        }
        res.status(200).json(Notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las Notificaciones', error });
    }
}

const getNoticiaPorId = async (req, res) =>{
    const { id_usuario, id_noticia } = req.params;
    
    try {
        const noticia = await getNoticiaPorIdDB(id_usuario, id_noticia);
        // Verifica si la noticia existe
        if (!noticia || noticia.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        res.status(200).json(noticia[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la noticia', error });
    }
}

const getUltimasNotificaciones = async (req, res) => {
    const { id_usuario } = req.params;
    try{
        const Notificaciones = await getUltimasNotificacionesDB(id_usuario);
        if (!Notificaciones || Notificaciones.length === 0) {
            return res.status(404).json({ message: 'No hay Notificaciones disponibles' });
        }

        res.status(200).json(Notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la última noticia', error });
    }
}

const getNotificacionesPorCategoria = async (req, res) => {
    const { id_usuario, id_categoria } = req.params;
    try{
        const Notificaciones = await getNotificacionesPorCategoriaDB(id_usuario, id_categoria);
        if (!Notificaciones || Notificaciones.length === 0) {
            return res.status(404).json({ message: 'No hay Notificaciones disponibles para esta categoría' });
        }
        res.status(200).json(Notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener Notificaciones por categoría', error });
    }
}

const getNotificacionesPorMesAnho = async (req, res) => {
    const { id_usuario, mes, anho } = req.params;
    try {
        const Notificaciones = await getNotificacionesPorMesAnhoDB(mes, anho, id_usuario);
        if (!Notificaciones || Notificaciones.length === 0) {
            return res.status(404).json({ message: 'No hay Notificaciones disponibles para este mes y año' });
        }
        res.status(200).json(Notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener Notificaciones por mes y año', error });
    }
}

const getCategoriasNotificaciones = async (req, res) =>{
    const { id_usuario } = req.params;

    try{

        const categorias = await getCategoriasNotificacionesDB(id_usuario);
        if (!categorias || categorias.length === 0) {
            return res.status(404).json({ message: 'No hay categorías de Notificaciones disponibles' });
        }
        res.status(200).json(categorias);

    } catch (error){
        res.status(500).json({ message: 'Error al obtener las categorías de Notificaciones', error });
    }
}

export default {
    getAllNotificaciones,
    getNoticiaPorId,
    getUltimasNotificaciones,
    getNotificacionesPorCategoria,
    getNotificacionesPorMesAnho,
    getCategoriasNotificaciones
}