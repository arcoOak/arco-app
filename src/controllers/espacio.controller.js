import {
    getAllEspaciosReservablesDB,
    getEspacioByCategoriaDB,
    getEspacioByIdDB,
    getEspacioUnidadesByIdDB,
    getCategoriasEspacioDisponibleDB
} from '../models/espacio.model.js';

const getAllEspaciosReservables = async (req, res) => {
    try {
        const espacios = await getAllEspaciosReservablesDB();
        res.status(200).json(espacios);
    } catch (error) {
        console.error('Error al obtener los espacios reservables:', error);
        res.status(500).json({ message: 'Error al obtener los espacios reservables' });
    }
}

const getEspacioByCategoria = async (req, res) => {
    const { id_categoria_espacio } = req.params;
    try {
        const espacios = await getEspacioByCategoriaDB(id_categoria_espacio);
        if (!espacios || espacios.length === 0) {
            return res.status(404).json({ message: 'No se encontraron espacios para esta categoría' });
        }
        res.status(200).json(espacios);
    } catch (error) {
        console.error('Error al obtener los espacios por categoría:', error);
        res.status(500).json({ message: 'Error al obtener los espacios' });
    }
};

const getEspacioById = async (req, res) => {
    const { id } = req.params;
    try {
        const espacioRows = await getEspacioByIdDB(id);
        if (!espacioRows || espacioRows.length === 0) {
            return res.status(404).json({ message: 'Espacio no encontrado' });
        }
        res.status(200).json(espacioRows[0]);
    } catch (error) {
        console.error('Error al obtener el espacio por ID:', error);
        res.status(500).json({ message: 'Error al obtener el espacio' });
    }
};

const getEspacioUnidadesById = async (req, res) => {
    const { id } = req.params;
    try {
        const unidades = await getEspacioUnidadesByIdDB(id);
        if (!unidades || unidades.length === 0) {
            return res.status(404).json({ message: 'Unidades no encontradas para el espacio' });
        }
        res.status(200).json(unidades);
    } catch (error) {
        console.error('Error al obtener las unidades del espacio:', error);
        res.status(500).json({ message: 'Error al obtener las unidades del espacio' });
    }
}

const getCategoriasEspacioDisponible = async (req, res) => {
    try {
        const categorias = await getCategoriasEspacioDisponibleDB();
        res.status(200).json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías de espacio disponibles:', error);
        res.status(500).json({ message: 'Error al obtener categorías de espacio disponibles' });
    }
};

export default {
    getAllEspaciosReservables,
    getEspacioByCategoria,
    getEspacioById,
    getEspacioUnidadesById,
    getCategoriasEspacioDisponible
};