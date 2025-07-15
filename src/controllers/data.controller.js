import {
    getGenerosDB, getParentescosDB, getParentescosByGeneroDB, getCategoriasComercioDB
} from '../models/data.model.js';

const getGeneros = async (req, res) => {
    try {
        const generos = await getGenerosDB();
        res.json(generos);
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener géneros' });
    }
}

const getParentescos = async (req, res) => {
    try {
        const parentescos = await getParentescosDB();
        res.json(parentescos);
    } catch (error) {
        console.error('Error al obtener parentescos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener parentescos' });
    }
}

const getParentescosByGenero = async (req, res) => {
    try {
        const parentescos = await getParentescosByGeneroDB();
        res.json(parentescos);
    } catch (error) {
        console.error('Error al obtener parentescos por género:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener parentescos por género' });
    }
}



const getCategoriasComercio = async (req, res) => {
    try {
        const categorias = await getCategoriasComercioDB();
        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías de comercio:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener categorías de comercio' });
    }
}

export default{
    getGeneros,
    getParentescos,
    getParentescosByGenero,
    getCategoriasComercio
}