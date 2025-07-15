import {
    getQrTokenByUsuarioDB,
    getQrTokenByUsuarioFamiliarDB,
    createQrTokenDB,
    createQrTokenFamiliarDB,
    updateQrTokenDB,
    updateQrTokenFamiliarDB,
    validarQrTokenDB
} from '../models/qrtoken.model.js';

import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';


const getQrTokenByUsuario = async (req, res) => {
    const { id_usuario, id_rol  } = req.params;
    try {
        if (!id_usuario) {
            return res.status(400).json({ message: 'El ID de usuario es requerido.' });
        }
        const {success, data} = await getQrTokenByUsuarioDB(id_usuario, id_rol);
        if (!success) {
            res.json({ token: '', message: 'Token QR no encontrado para este usuario' });
        }else{
            res.json({token: data.token});
        }
       
    } catch (error) {
        console.error('Error al obtener el token QR por ID Usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener token QR por ID Usuario' });
    }
}

const getQrTokenByUsuarioFamiliar = async (req, res) => {
    const { id_usuario, id_rol , id_familiar } = req.params;
    try {
        if (!id || !id_familiar) {
            return res.status(400).json({ message: 'El ID de usuario y el ID de familiar son requeridos.' });
        }
        const {success, data} = await getQrTokenByUsuarioFamiliarDB(id, id_rol, id_familiar);
        if (!success) {
            res.json({ token: '', message: 'Token QR no encontrado para este usuario y familiar' });
        }else{
            res.json({token: data.token});
        }
       
    }
    catch (error) {
        console.error('Error al obtener el token QR por ID Usuario y Familiar:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener token QR por ID Usuario y Familiar' });
    }
}

const createQrToken = async (req, res) => {
    const { id_usuario, id_rol } = req.body;
    try {
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '1m', jwtid: jti }); // Genera un token JWT con una expiración de 1 hora

        const {success, data} = await createQrTokenDB(id_usuario, token, id_rol);
        if (!success) {
            return res.status(400).json({ message: 'Error al crear el token QR, verifique los datos' });
        }
        res.json({token: data.token} );
    } catch (error) {
        console.error('Error al crear el token QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear token QR' });
    }
}

const createQrTokenFamiliar = async (req, res) => {
    const { id_usuario, id_rol, id_familiar } = req.body;
    try {
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, id_familiar: id_familiar};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti }); // Genera un token JWT con una expiración de 1 hora

        const {success, data} = await createQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar);
        if (!success) {
            return res.status(400).json({ message: 'Error al crear el token QR, verifique los datos' });
        }
        res.json({token: data.token} );
    } catch (error) {
        console.error('Error al crear el token QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear token QR' });
    }
}

const updateQrToken = async (req, res) => {
    
    const { id_usuario } = req.params;
    const { id_rol } = req.body; 

    try {
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '1m', jwtid: jti });

        const {success , data} = await updateQrTokenDB(id_usuario, token, id_rol);
        if (!success) {
            return res.status(404).json({ message: 'Token QR no encontrado para actualizar' });
        }
        res.json({token: data.token});
    } catch (error) {
        console.error('Error al actualizar el token QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar token QR' });
    }
}

const updateQrTokenFamiliar = async (req, res) => {
    const { id_usuario } = req.params;
    const { id_rol, id_familiar } = req.body;

    try{
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, id_familiar: id_familiar};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti });

        const {success , data} = await updateQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar);
        if (!success) {
            return res.status(404).json({ message: 'Token QR no encontrado para actualizar' });
        }
        res.json({token: data.token});
    }
    catch (error) {
        console.error('Error al actualizar el token QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar token QR' });
    }
}

const validarQrToken = async (req, res) => {
    const { token } = req.body;
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id_usuario) {
            return res.status(400).json({ message: 'Token QR inválido o expirado' });
        }

        const {success, rowsTotal} = await validarQrTokenDB(token);
        if (!success) {
            return res.status(404).json({ message: 'Token QR no encontrado o ya ha sido utilizado' });
        }
        res.json({ message: decoded, total: rowsTotal });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token QR ha expirado.' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Token QR inválido.' });
        }
        console.error('Error al validar el token QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al validar token QR' });
    }
}

const generateOrUpdateQrToken = async (req, res) => {
    const { id_usuario, id_rol } = req.body;
    try {

        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '1m', jwtid: jti }); // Genera un token JWT con una expiración de 1 hora

        let result;
        const {success, data} = await getQrTokenByUsuarioDB(id_usuario, id_rol);
        if (!success) {
            // Si no existe el token, lo creamos
            result = await createQrTokenDB(id_usuario, token, id_rol);
        } else {
            // Si existe el token, lo actualizamos
            result = await updateQrTokenDB(id_usuario, token, id_rol);
        }
        res.json({token: result.data.token});
    } catch (error) {
        console.error('Error al generar o actualizar el token QR:', error);
        res.status(500).json({ message: 'Error interno del servidor al generar o actualizar token QR' });
    }
}

const generateOrUpdateQrTokenFamiliar = async (req, res) => {
    const { id_usuario, id_rol, id_familiar } = req.body;
    try {
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, id_familiar: id_familiar};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti }); // Genera un token JWT con una expiración de 24h

        const {success, data} = await getQrTokenByUsuarioFamiliarDB(id_usuario, id_rol, id_familiar);

        let result;
        if (!success) {
            // Si no existe el token, lo creamos
            result = await createQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar);
        } else {
            // Si existe el token, lo actualizamos
            result = await updateQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar);
        }
        res.json({token: result.data.token});
    } catch (error) {
        console.error('Error al generar o actualizar el token QR familiar:', error);
        res.status(500).json({ message: 'Error interno del servidor al generar o actualizar token QR familiar' });
    }
}


export default {
    getQrTokenByUsuario,
    getQrTokenByUsuarioFamiliar,
    createQrToken,
    createQrTokenFamiliar,
    updateQrToken,
    updateQrTokenFamiliar,
    validarQrToken,
    generateOrUpdateQrToken,
    generateOrUpdateQrTokenFamiliar
};