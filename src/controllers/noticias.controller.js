import {
    getAllNoticiasDB,
    getNoticiaPorIdDB,
    getUltimasNoticiasDB,
    getNoticiasPorCategoriaDB,
    getNoticiasPorMesAnhoDB,
    getCategoriasNoticiasDB
} from '../models/noticias.model.js';


const getAllNoticias = async (req, res) => {
    const { id_club } = req.params;
    try {
        const noticias = await getAllNoticiasDB(id_club);
        if (!noticias || noticias.length === 0) {
            return res.status(404).json({ message: 'No hay noticias disponibles' });
        }
        res.status(200).json(noticias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las noticias', error });
    }
}

const getNoticiaPorId = async (req, res) =>{
    const { id_club, id_noticia } = req.params;
    
    try {
        const noticia = await getNoticiaPorIdDB(id_club, id_noticia);
        // Verifica si la noticia existe
        if (!noticia || noticia.length === 0) {
            return res.status(404).json({ message: 'Noticia no encontrada' });
        }
        res.status(200).json(noticia[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la noticia', error });
    }
}

const getUltimasNoticias = async (req, res) => {
    const { id_club } = req.params;
    try{
        const noticias = await getUltimasNoticiasDB(id_club);
        if (!noticias || noticias.length === 0) {
            return res.status(404).json({ message: 'No hay noticias disponibles' });
        }

        res.status(200).json(noticias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la última noticia', error });
    }
}

const getNoticiasPorCategoria = async (req, res) => {
    const { id_club, id_categoria } = req.params;
    try{
        const noticias = await getNoticiasPorCategoriaDB(id_club, id_categoria);
        if (!noticias || noticias.length === 0) {
            return res.status(404).json({ message: 'No hay noticias disponibles para esta categoría' });
        }
        res.status(200).json(noticias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener noticias por categoría', error });
    }
}

const getNoticiasPorMesAnho = async (req, res) => {
    const { id_club, mes, anho } = req.params;
    try {
        const noticias = await getNoticiasPorMesAnhoDB(mes, anho, id_club);
        if (!noticias || noticias.length === 0) {
            return res.status(404).json({ message: 'No hay noticias disponibles para este mes y año' });
        }
        res.status(200).json(noticias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener noticias por mes y año', error });
    }
}

const getCategoriasNoticias = async (req, res) =>{
    const { id_club } = req.params;

    try{

        const categorias = await getCategoriasNoticiasDB(id_club);
        if (!categorias || categorias.length === 0) {
            return res.status(404).json({ message: 'No hay categorías de noticias disponibles' });
        }
        res.status(200).json(categorias);

    } catch (error){
        res.status(500).json({ message: 'Error al obtener las categorías de noticias', error });
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