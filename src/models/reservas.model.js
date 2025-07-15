import pool from '../config/db.config.js';

const getReservaByIdDB = async (id_reserva) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM reservaciones WHERE id_reservacion = ?`, 
            [id_reserva]
        );
        if (rows.length === 0) {
            return null; // Retorna null si no se encuentra la reserva
        }
        return rows[0]; // Retorna el primer resultado

    }catch (error) {
        console.error("Error al obtener la reserva por ID:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getReservasByEspacioUnidadDB = async (id_espacio) => {
    try{
        const [rows] = await pool.execute(
            `SELECT * FROM reservaciones WHERE id_espacio_reservable = ?`,
            [id_espacio]
        );
        if (rows.length === 0) {
            return []; // Retorna un array vacío si no hay reservas
        }
        return rows;
    }catch (error) {
        console.error("Error al obtener reservas por espacio:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getReservasPorUsuarioDB = async (id_usuario) => {
    try{
        const [rows] = await pool.execute(
            `SELECT * FROM reservaciones WHERE id_usuario = ?`, [id_usuario]);
        
        if (rows.length === 0) {
            return []; // Retorna un array vacío si no hay reservas
        }
        
        return rows;
    }catch (error) {
        console.error("Error al obtener reservas por usuario:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getReservasByEspacioUnidadMesDB = async (id_espacio, mes) => {
    try{
        const [rows] = await pool.execute(
            `SELECT * FROM reservaciones WHERE id_espacio_reservable = ? AND EXTRACT(MONTH FROM fecha_reserva) = ?`, [id_espacio, mes]
        );
        return rows;
    }catch (error) {
        console.error("Error al obtener reservas por espacio y mes:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getReservaByUsuarioMesDB = async (id_usuario, mes) => {
    try {
        const [rows] = await pool.execute(
            `SELECT * FROM reservaciones WHERE id_usuario = ? AND EXTRACT(MONTH FROM fecha_reserva) = ?`, 
            [id_usuario, mes]
        );
        return rows;
    } catch (error) {
        console.error("Error al obtener reservas por usuario y mes:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getHorasReservadasPorUnidadFechaDB = async (id_unidad, fecha) => {
    try {
        const [rows] = await pool.execute(
            `SELECT b.hora_reserva FROM reservaciones_horas b JOIN reservaciones a ON a.id_reservacion = b.id_reservacion WHERE a.id_espacio_reservable = ? AND a.fecha_reservacion = ?`, 
            [id_unidad, fecha]
        );
        return rows;
    } catch (error) {
        console.error("Error al obtener horas reservadas por unidad y fecha:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const getHorasReservadasPorReservaDB = async (id_reserva) => {
    try {
        const [rows] = await pool.execute(
            `SELECT hora_reserva FROM reservaciones_horas WHERE id_reservacion = ?`, 
            [id_reserva]
        );
        return rows;
    } catch (error) {
        console.error("Error al obtener horas reservadas por reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createReservaDB = async (reservaData, db_connection) => {
    const executor = db_connection || pool; // Usa la conexión proporcionada o el pool por defecto
    try {
        const { id_espacio_reservable, id_espacio_reservable_unidad, fecha_reservacion, nota, coste_total, id_socio } = reservaData;
        const [result] = await executor.query(
            `INSERT INTO reservaciones (id_espacio_reservable, id_espacio_reservable_unidad, fecha_reservacion, nota, costo_reserva, id_socio, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [id_espacio_reservable, id_espacio_reservable_unidad, fecha_reservacion, nota, coste_total, id_socio]
        );
        return result.insertId; // Retorna el ID de la nueva reserva
    }
    catch (error) {
        console.error("Error al crear la reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createReservaHorasDB = async (id_reserva, horariosReserva, db_connection) => {
    const executor = db_connection || pool; // Usa la conexión proporcionada o el pool por defecto
    try {
        const values = horariosReserva.map(hora => [id_reserva, hora]);
        const [result] = await executor.query(
            `INSERT INTO reservaciones_horas (id_reservacion, hora_reserva) VALUES ?`,
            [values]
        );
        return result.affectedRows; // Retorna el número de filas afectadas
    } catch (error) {
        console.error("Error al crear las horas de la reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createReservaInvitadosDB = async (id_reserva, invitadosReserva, db_connection) => {
    const executor = db_connection || pool;
    try {
        const values = invitadosReserva.map(invitado => [id_reserva, invitado.id_rol ,invitado.id_familiar]);
        const [result] = await executor.query(
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
    getReservaByIdDB,
    getReservasByEspacioUnidadDB,
    getReservasPorUsuarioDB,
    getReservasByEspacioUnidadMesDB,
    getReservaByUsuarioMesDB,
    getHorasReservadasPorUnidadFechaDB,
    getHorasReservadasPorReservaDB,
    createReservaDB,
    createReservaHorasDB,
    createReservaInvitadosDB
};