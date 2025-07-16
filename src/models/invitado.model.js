import pool from '../config/db.config.js';

const getCantidadInvitadosPorUsuarioMesDB = async (id_usuario, mes) => {
    try {
        const [rows] = await pool.execute(
            `SELECT COUNT(*) AS cantidad_invitados 
            FROM invitados
            WHERE id_usuario = ? AND MONTH(fecha_ingreso_club) = ?`, 
            [id_usuario, mes]
        );
        return rows[0].cantidad_invitados; // Retorna la cantidad de invitados
    } catch (error) {
        console.error("Error al obtener la cantidad de invitados por usuario y mes:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const removeInvitadoByIdDB = async (id_invitado, db_connection) => {
    const executor = db_connection || pool;
    try {
        const [result] = await executor.query(
            `DELETE FROM invitados WHERE id_invitado = ?`, 
            [id_invitado]
        );
        return result.affectedRows > 0; // Retorna true si se eliminaron invitados
    } catch (error) {
        console.error("Error al eliminar invitados por reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const removeInvitadoFromReservaDB = async (id_reserva, id_invitado, db_connection) => {
    const executor = db_connection || pool;
    try {
        const [result] = await executor.query(
            `DELETE FROM reservaciones_invitados WHERE id_reservacion = ? AND id = ? AND id_rol = 4`, 
            [id_reserva, id_invitado]
        );
        return result.affectedRows > 0; // Retorna true si se eliminó el invitado
    } catch (error) {
        console.error("Error al eliminar un invitado de la reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createInvitadoDB = async (invitado) => {
    try {
        const [result] = await pool.execute(
            `INSERT INTO invitados (id_usuario, nombre, apellido, fecha_ingreso_club, documento_identidad, correo) VALUES (?, ?, ?, NOW(), ? , ?)`,
            [invitado.id_usuario, invitado.nombre, invitado.apellido, invitado.documento_identidad, invitado.correo]
        );
        return result.insertId; // Retorna el ID del nuevo invitado
    } catch (error) {
        console.error("Error al crear un nuevo invitado:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createReservaInvitadosDB = async (id_reserva, invitadosReserva) => {
    try {
        const values = invitadosReserva.map(invitado => [id_reserva, invitado.id_rol ,invitado.id_invitado]);
        const [result] = await pool.execute(
            `INSERT INTO reservaciones_invitados (id_reservacion, id_rol, id) VALUES ?`,
            [values]
        );
        return result.affectedRows; // Retorna el número de filas afectadas
    } catch (error) {
        console.error("Error al crear los invitados de la reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

export {
    getCantidadInvitadosPorUsuarioMesDB,
    removeInvitadoByIdDB,
    removeInvitadoFromReservaDB,
    createInvitadoDB,
    createReservaInvitadosDB
};