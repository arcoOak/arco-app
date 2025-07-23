import pool from '../config/db.config.js';



const getQrTokenByUsuarioDB = async (id_usuario, id_rol) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM qr_token WHERE id_usuario = ? AND id_rol = ? AND status = 1`,
            [id_usuario, id_rol]
        );
        //console.log("Rows obtenidos:", rows);
        if (rows.length == 0){
            return {success: false, data: null}; // Retorna false si no se encontró ningún registro
        } 
        return {success: true, data: rows[0]}; // Retorna el primer registro encontrado
    } catch (error) {
        console.error("Error al obtener el token QR por ID Usuario:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getQrTokenByUsuarioFamiliarDB = async (id_usuario, id_rol, id_familiar) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM qr_token WHERE id_usuario = ? AND id_rol = ? AND id_familiar = ? AND status = 1`,
            [id_usuario, id_rol, id_familiar]
        );
        //console.log("Rows obtenidos:", rows);
        if (rows.length == 0){
            return {success: false, data: null}; // Retorna false si no se encontró ningún registro
        } 
        return {success: true, data: rows[0]}; // Retorna el primer registro encontrado
    } catch (error) {
        console.error("Error al obtener el token QR por ID Usuario:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getQrTokenByUsuarioInvitadoDB = async (id_usuario, id_rol, id_invitado) => {
    try{
        const [rows] = await pool.execute(
            `SELECT * FROM qr_token WHERE id_usuario = ? AND id_rol = ? AND id_invitado = ? AND status = 1`,
            [id_usuario, id_rol, id_invitado]
        );
        //console.log("Rows obtenidos:", rows);
        if (rows.length == 0){
            return {success: false, data: null}; // Retorna false si no se encontró ningún registro
        } 
        return {success: true, data: rows[0]}; // Retorna el primer registro encontrado
    } catch (error) {
        console.error("Error al obtener el token QR por ID Usuario e Invitado:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createQrTokenDB = async (id_usuario, token, id_rol) => {
    try {
        const [result] = await pool.execute(
            `INSERT INTO qr_token (id_usuario, token, id_rol) VALUES (?, ?, ?)`,
            [id_usuario, token, id_rol]
        );
        if (result.affectedRows == 0) {
            return {success: false, data: null}; // Retorna false si no se insertó ningún registro
        }else{
            const newTokenData = await getQrTokenByUsuarioDB(id_usuario, id_rol); // Obtiene el token recién creado
            return {success: true, data: newTokenData.data}; // Retorna el ID del usuario y el nuevo token
        }
    } catch (error) {
        console.error("Error al crear el token QR:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createQrTokenFamiliarDB = async (id_usuario, token, id_rol, id_familiar) => {
    try {
        const [result] = await pool.execute(
            `INSERT INTO qr_token (id_usuario, token, id_rol, id_familiar) VALUES (?, ?, ?, ?)`,
            [id_usuario, token, id_rol, id_familiar]
        );
        if (result.affectedRows == 0) {
            return {success: false, data: null}; // Retorna false si no se insertó ningún registro
        }else{
            const newTokenData = await getQrTokenByUsuarioFamiliarDB(id_usuario, id_rol, id_familiar); // Obtiene el token recién creado
            return {success: true, data: newTokenData.data}; // Retorna el ID del usuario y el nuevo token
        }
    } catch (error) {
        console.error("Error al crear el token QR:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createQrTokenInvitadoDB = async (id_usuario, token, id_rol, dataInvitado) => {
    try {
        const { nombre, apellido, correo, documento_identidad } = dataInvitado;

        let invitadoId;

        const [createInvitado] = await pool.execute(
            `INSERT INTO invitados (id_usuario, nombre, apellido, correo, documento_identidad) VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, nombre, apellido, correo, documento_identidad]
        );

        if (createInvitado.affectedRows == 0) {
            return {success: false, data: null}; // Retorna false si no se insertó ningún registro
        }

        invitadoId = createInvitado.insertId; // Obtiene el ID del nuevo invitado

        const [result] = await pool.execute(
            `INSERT INTO qr_token (id_usuario, token, id_rol, id_invitado) VALUES (?, ?, ?, ?)`,
            [id_usuario, token, id_rol, invitadoId]
        );

        if (result.affectedRows == 0) {
            return {success: false, data: null}; // Retorna false si no se insert
        }else{
            const newTokenData = await getQrTokenByUsuarioInvitadoDB(id_usuario, id_rol, invitadoId); // Obtiene el token recién creado
            return {success: true, data: newTokenData.data}; // Retorna el ID del usuario y el nuevo token
        }
    } catch (error) {
        console.error("Error al crear el token QR invitado:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const updateQrTokenDB = async (id_usuario, new_token, id_rol) => {
    try {
        const [result] = await pool.execute(
            `UPDATE qr_token SET token = ? WHERE id_usuario = ? AND id_rol = ? AND status = 1`,
            [new_token, id_usuario, id_rol]
        );
         if (result.affectedRows == 0){// Retorna true si se actualizó al menos un registro
            return {success: false, data: null};
         } else{
            const newTokenData = await getQrTokenByUsuarioDB(id_usuario, id_rol); // Obtiene el nuevo token actualizado
            return {success: true, data: newTokenData.data}; // Retorna el ID del usuario y el nuevo token
         }
    } catch (error) {
        console.error("Error al actualizar el token QR:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const updateQrTokenFamiliarDB = async (id_usuario, new_token, id_rol, id_familiar) => {
    try {
        const [result] = await pool.execute(
            `UPDATE qr_token SET token = ? WHERE id_usuario = ? AND id_rol = ? AND id_familiar = ? AND status = 1`,
            [new_token, id_usuario, id_rol, id_familiar]
        );
         if (result.affectedRows == 0){// Retorna true si se actualizó al menos un registro
            return {success: false, data: null};
         } else{
            const newTokenData = await getQrTokenByUsuarioFamiliarDB(id_usuario, id_rol, id_familiar); // Obtiene el nuevo token actualizado
            return {success: true, data: newTokenData.data}; // Retorna el ID del usuario y el nuevo token
         }
    } catch (error) {
        console.error("Error al actualizar el token QR:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const validarQrTokenDB = async (token) => {
    try {
        const [result] = await pool.execute(
            `UPDATE qr_token SET status = 0 WHERE token = ? AND status = 1`,
            [token]
        );
        if (result.affectedRows == 0){
            return {success: false, rowsTotal: result.affectedRows}; // Retorna false si no se actualizó ningún registro
        } else{
            return {success: true, rowsTotal: result.affectedRows}; // Retorna true si se actualizó al menos un registro
        }
    } catch (error) {
        console.error("Error al validar el token QR:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

export {
    getQrTokenByUsuarioDB,
    getQrTokenByUsuarioFamiliarDB,
    getQrTokenByUsuarioInvitadoDB,
    createQrTokenDB,
    createQrTokenFamiliarDB,
    createQrTokenInvitadoDB,
    updateQrTokenDB,
    updateQrTokenFamiliarDB,
    validarQrTokenDB
};