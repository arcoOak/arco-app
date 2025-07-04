import {
    getAllProductosDB,
    getAllProductosIndividualesDB,
    getProductoByIdDB,
    getProductosPorComercioDB
} from '../models/producto.model.js';

const getAllProductos = async (req, res) => {
    try {
        const productos = await getAllProductosDB();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener todos los productos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos' });
    }
}

const getAllProductosIndividuales = async (req, res) => {
    try {
        const productos = await getAllProductosIndividualesDB();
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


export default {
    getAllProductos,
    getAllProductosIndividuales,
    getProductoById,
    getProductosPorComercio
};