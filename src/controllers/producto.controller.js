import {
    getAllProductosDB,
    getAllProductosIndividualesDB,
    getProductoByIdDB,
    getProductosPorComercioDB,
    getCategoriasDeProductosPorComercioDB
} from '../models/producto.model.js';

const getAllProductos = async (req, res) => {
    const { id_club } = req.params;
    try {
        const productos = await getAllProductosDB(id_club);
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos' });
    }
}

const getAllProductosIndividuales = async (req, res) => {
    const { id_club } = req.params;
    try {
        const productos = await getAllProductosIndividualesDB(id_club);
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos' });
    }
}

const getProductoById = async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await getProductoByIdDB(id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener producto por ID' });
    }
}

const getProductosPorComercio = async (req, res) => {
    const { id_comercio } = req.params;
    try {
        const productos = await getProductosPorComercioDB(id_comercio);
        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para este comercio' });
        }
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener los productos por comercio:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos por comercio' });
    }
}

const getCategoriasDeProductosPorComercio = async (req, res) =>{
    const { id_comercio } = req.params
    try {
        const categorias = await getCategoriasDeProductosPorComercioDB(id_comercio);
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías de productos por comercio:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener categorías de productos por comercio' });
    }
}


export default {
    getAllProductos,
    getAllProductosIndividuales,
    getProductoById,
    getProductosPorComercio,
    getCategoriasDeProductosPorComercio
};