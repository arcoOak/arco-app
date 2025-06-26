import {
    getGenerosDB, getParentescos, getParentescosByGenero
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

const getParentescosList = async (req, res) => {
    try {
        const parentescos = await getParentescos();
        res.json(parentescos);
    } catch (error) {
        console.error('Error al obtener parentescos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener parentescos' });
    }
}

const getParentescosByGeneroList = async (req, res) => {
    try {
        const parentescos = await getParentescosByGenero();
        res.json(parentescos);
    } catch (error) {
        console.error('Error al obtener parentescos por género:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener parentescos por género' });
    }
}

export default{
    getGeneros,
    getParentescosList,
    getParentescosByGeneroList
}