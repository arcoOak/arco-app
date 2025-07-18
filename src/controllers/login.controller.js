import {
    getLoginDB, 
} from '../models/login.model.js';

const getLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        //console.log ('Datos de login recibidos:', { username, password });
        if(!username || !password) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }
        const loginData = await getLoginDB(username, password);

        //console.log('Datos de login obtenidos:', loginData);

        if (!loginData || !loginData.response) {
            return res.json({
                response: false,
            });
        }

        console.log('Login exitoso:', loginData);

        return res.json(loginData);
    } catch (error) {
        console.error('Error al obtener login:', error);
        if (error.code === 'ER_BAD_DB_ERROR') {
            return res.status(500).json({ response:false, message: 'Error de conexión a la base de datos' });
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(403).json({ response:false, message: 'Acceso denegado' });
        }
        return res.status(500).json({ response:false, message: 'Error interno del servidor al obtener login' });
    }
}


export default{
    getLogin,
}