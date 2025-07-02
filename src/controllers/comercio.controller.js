import {
    getAllComerciosDB,
    getAllComerciosActivosDB,
    getComercioByIdDB,
    getCategoriasComercioDisponibleDB
} from '../models/comercio.model.js';

const getAllComercios = async (req, res) => {
    try {
        const comercios = await getAllComerciosDB();
        res.json(comercios);
    } catch (error) {
        console.error('Error al obtener todos los comercios:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener comercios' });
    }
}

const getAllComerciosActivos = async (req, res) => {
    try {
        const comercios = await getAllComerciosActivosDB();
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
        res.json(comercio);
    } catch (error) {
        console.error('Error al obtener el comercio por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener comercio por ID' });
    }
}

const getCategoriasComercioDisponible = async (req, res) => {
    try {
        const categorias = await getCategoriasComercioDisponibleDB();
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