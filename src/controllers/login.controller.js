import {
    getLoginDB, 
} from '../models/login.model.js';

const getLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }
        const loginData = await getLoginDB(username, password);
        res.json(loginData);
    } catch (error) {
        console.error('Error al obtener login:', error);
        if (error.code === 'ER_BAD_DB_ERROR') {
            return res.status(500).json({ message: 'Error de conexión a la base de datos' });
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        res.status(500).json({ message: 'Error interno del servidor al obtener login' });
    }
}


export default{
    getLogin,
}