import {
    getAllComerciosDB,
    getAllComerciosActivosDB,
    getComercioByIdDB,
    getCategoriasComercioDisponibleDB
} from '../models/comercio.model.js';

const getAllComercios = async (req, res) => {
    const { id_club } = req.params; // Asegúrate de que el id_club se pase como query parameter
    try {
        const comercios = await getAllComerciosDB(id_club);
        res.json(comercios);
    } catch (error) {
        console.error('Error al obtener todos los comercios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener comercios' });
    }
}

const getAllComerciosActivos = async (req, res) => {
    const { id_club, id_tipo_comercio } = req.params; // Asegúrate de que estos parámetros se pasen correctamente
    try {
        const comercios = await getAllComerciosActivosDB(id_club, id_tipo_comercio);
        res.json(comercios);
    } catch (error) {
        console.error('Error al obtener comercios activos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener comercios activos' });
    }
}

const getComercioById = async (req, res) => {
    const { id } = req.params;
    try {
        const comercio = await getComercioByIdDB(id);
        if (!comercio) {
            return res.status(404).json({ message: 'Comercio no encontrado' });
        }
        console.log('Comercio encontrado:', comercio);
        res.json(comercio);
    } catch (error) {
        console.error('Error al obtener el comercio por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener comercio por ID' });
    }
}

const getCategoriasComercioDisponible = async (req, res) => {
    const { id_club, id_tipo_comercio } = req.params; // Asegúrate de que el id_club se pase como query parameter
    try {
        const categorias = await getCategoriasComercioDisponibleDB(id_club, id_tipo_comercio);
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías de comercio disponibles:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener categorías de comercio disponibles' });
    }   
}

export default {
    getAllComercios,
    getAllComerciosActivos,
    getComercioById,
    getCategoriasComercioDisponible
};