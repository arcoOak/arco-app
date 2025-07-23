import {
    getQrTokenByUsuarioDB,
    getQrTokenByUsuarioFamiliarDB,
    getQrTokenByUsuarioInvitadoDB,
    createQrTokenDB,
    createQrTokenFamiliarDB,
    createQrTokenInvitadoDB,
    updateQrTokenDB,
    updateQrTokenFamiliarDB,
    validarQrTokenDB
} from '../models/qrtoken.model.js';

import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import qrcode from 'qrcode';



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
        if (!id_usuario || !id_familiar) {
            return res.status(400).json({ message: 'El ID de usuario y el ID de familiar son requeridos.' });
        }
        const {success, data} = await getQrTokenByUsuarioFamiliarDB(id_usuario, id_rol, id_familiar);
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

const getQrTokenByUsuarioInvitado = async (req, res) => {
    const { id_usuario, id_rol , id_invitado } = req.params;
    try {
        if (!id_usuario || !id_invitado) {
            return res.status(400).json({ message: 'El ID de usuario y el ID de invitado son requeridos.' });
        }
        const {success, data} = await getQrTokenByUsuarioInvitadoDB(id_usuario, id_rol, id_invitado);
        if (!success) {
            res.json({ token: '', message: 'Token QR no encontrado para este usuario e invitado' });
        }else{
            res.json({token: data.token});
        }
       
    } catch (error) {
        console.error('Error al obtener el token QR por ID Usuario e Invitado:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener token QR por ID Usuario e Invitado' });
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

const generateQrTokenInvitado = async (req, res) => {
    const { id_usuario, id_rol, dataInvitado } = req.body;
    try {
        const jti = randomBytes(16).toString('hex');
        const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, dataInvitado: dataInvitado};

        const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti }); // Genera un token JWT con una expiración de 24h

        let result = await createQrTokenInvitadoDB(id_usuario, token, id_rol, dataInvitado);
        
        res.json({token: result.data.token});
    } catch (error) {
        console.error('Error al generar o actualizar el token QR invitado:', error);
        res.status(500).json({ message: 'Error interno del servidor al generar o actualizar token QR invitado' });
    }
}

const enviarInvitacionQr = async (req, res) => {
    const { id_usuario, id_rol, dataInvitado } = req.body;

    if (!dataInvitado || !dataInvitado.correo) {
        return res.status(400).json({ message: 'El correo del invitado es requerido.' });
    }

    try {
        let tokenResponse;
        let nombreInvitado = "Invitado";

        // 1. Generar el token según el tipo de invitado
        if (id_rol === 3) {
            tokenResponse = await getQrTokenByUsuarioFamiliarDB(id_usuario, id_rol, dataInvitado.id_familiar);
            nombreInvitado = dataInvitado.nombre + ' ' + dataInvitado.apellido || nombreInvitado;
        } else if (id_rol === 4) {

            //console.log("Data Invitado:", dataInvitado);

            if(!dataInvitado.id_invitado) {
                return res.json({ message: 'El ID del invitado es requerido.' });
            }

            tokenResponse = await getQrTokenByUsuarioInvitadoDB(id_usuario, id_rol, dataInvitado.id_invitado);
            nombreInvitado = dataInvitado.nombre + ' ' + dataInvitado.apellido || nombreInvitado;
        } else {
            return res.status(400).json({ message: 'Tipo de invitado no válido.' });
        }

        // console.log('Token Response:', tokenResponse.data);


        if (!tokenResponse || !tokenResponse.data.token) {
             throw new Error('No se pudo generar el token QR.');
        }

        // // 2. Generar el código QR como una imagen en formato Data URL
        const qrCodeDataURL = await qrcode.toDataURL(tokenResponse.data.token);

        //console.log('Nombre del invitado:', nombreInvitado);
        //console.log('Token QR generado:', tokenResponse.token);
        //console.log('QR Code Data URL:', qrCodeDataURL);

        // 3. Configurar el transportador de correo


        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL_USER, // tu-correo@gmail.com
        //         pass: process.env.EMAIL_PASS, // tu contraseña de aplicación
        //     },
        // });

        // // 4. Enviar el correo con el QR adjunto
        // await transporter.sendMail({
        //     from: `"DOMEXVE" <${process.env.EMAIL_USER}>`,
        //     to: invitado.correo,
        //     subject: '¡Tienes una invitación!',
        //     html: `
        //         <h1>¡Hola, ${nombreInvitado}!</h1>
        //         <p>Has recibido una invitación. Presenta el siguiente código QR para ingresar.</p>
        //         <img src="${qrCodeDataURL}" alt="Código QR de Invitación"/>
        //         <p>¡Te esperamos!</p>
        //     `,
        // });

        res.status(200).json({ message: 'Invitación enviada exitosamente.' });

    } catch (error) {
        console.error('Error al enviar la invitación:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
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
    generateOrUpdateQrTokenFamiliar,
    generateQrTokenInvitado,
    enviarInvitacionQr
};