import pool from '../config/db.config.js';

const getReservaByIdDB = async (id_reserva) => {
    try {
        const [rows] = await pool.execute(
            `SELECT a.*, b.nombre_espacio_reservable, c.nombre_unidad, c.descripcion, c.capacidad, c.costo_reserva, c.ubicacion
            FROM reservaciones a
            JOIN espacios_reservables b ON b.id_espacio_reservable = a.id_espacio_reservable 
            JOIN espacios_reservables_unidad c ON c.id_espacio_reservable_unidad = a.id_espacio_reservable_unidad 
            WHERE a.id_reservacion = ?`, 
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
            `SELECT a.*, count(b.id_reservacion_hora) cant_horas, c.nombre_espacio_reservable, d.nombre_unidad 
            FROM reservaciones a 
            JOIN reservaciones_horas b ON a.id_reservacion = b.id_reservacion 
            JOIN espacios_reservables c ON c.id_espacio_reservable = a.id_espacio_reservable 
            JOIN espacios_reservables_unidad d ON d.id_espacio_reservable_unidad = a.id_espacio_reservable_unidad 
            WHERE id_socio = ? group by id_reservacion`, [id_usuario]);
        
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
            `SELECT a.*, count(b.id_reservacion_hora) cant_horas, c.nombre_espacio_reservable, d.nombre_unidad FROM reservaciones a JOIN reservaciones_horas b ON a.id_reservacion = b.id_reservacion JOIN espacios_reservables c ON c.id_espacio_reservable = a.id_espacio_reservable JOIN espacios_reservables_unidad d ON d.id_espacio_reservable_unidad = a.id_espacio_reservable_unidad WHERE id_socio = ? AND MONTH(a.fecha_reservacion) = ? group by id_reservacion`, 
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
            `SELECT b.hora_reserva FROM reservaciones_horas b JOIN reservaciones a ON a.id_reservacion = b.id_reservacion WHERE a.id_espacio_reservable_unidad = ? AND a.fecha_reservacion = ?`, 
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

const getInvitadosPorReservaDB = async (id_reserva) => {
    try {
        const [rows] = await pool.execute(
            `SELECT a.*, 
            CASE 
                WHEN a.id_rol = 3 THEN 'Familiar'
                WHEN a.id_rol = 4 THEN 'Invitado'
            END AS tipo_invitado,
            CASE 
                WHEN a.id_rol = 3 THEN (SELECT CONCAT(f.nombre, ' ', f.apellido) FROM familiares f WHERE f.id_familiar = a.id)
                WHEN a.id_rol = 4 THEN (SELECT CONCAT(i.nombre, ' ', i.apellido) FROM invitados i WHERE i.id_invitado = a.id)
            END AS nombre_invitado
            FROM reservaciones_invitados a 
            WHERE a.id_reservacion = ?`,
            [id_reserva]
        );
        return rows;
    } catch (error) {
        console.error("Error al obtener los invitados por reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createReservaDB = async (reservaData, db_connection) => {
    const executor = db_connection || pool; // Usa la conexión proporcionada o el pool por defecto
    try {
        const { id_espacio_reservable, id_espacio_reservable_unidad, fecha_reservacion, nota, coste_total, id_socio } = reservaData;
        const [result] = await executor.execute(
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
        const placeholders = values.map(() => '(?, ?)').join(', ');
        const flatValues = values.flat();
        const [result] = await executor.execute(
            `INSERT INTO reservaciones_horas (id_reservacion, hora_reserva) VALUES ${placeholders}`,
            flatValues
        );
        return result.affectedRows; // Retorna el número de filas afectadas
    } catch (error) {
        console.error("Error al crear las horas de la reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createInvitadoDB = async (id_usuario, invitado, db_connection) => {
    const executor = db_connection || pool;
    try {
        const [result] = await executor.execute(
            `INSERT INTO invitados (id_usuario, nombre, apellido, documento_identidad, correo) VALUES (?, ?, ?, ? , ?)`,
            [
                id_usuario, 
                invitado.nombre, 
                invitado.apellido, 
                invitado.documento_identidad, 
                invitado.correo
            ]
        );
        return result.insertId; // Retorna el ID del nuevo invitado
    } catch (error) {
        console.error("Error al crear un nuevo invitado:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createInvitadosEnReservaDB = async (id_reserva, listaInvitados, db_connection) => {
    const executor = db_connection || pool; // Usa la conexión proporcionada o el pool por defecto
    try {
        const values = listaInvitados.map(invitado => [id_reserva, invitado.id_rol , invitado.id_invitado]); // 4 es el id_rol para invitados
        const placeholders = values.map(() => '(?, ?, ?)').join(', ');
        const flatValues = values.flat();
        const [result] = await executor.execute(
            `INSERT INTO reservaciones_invitados (id_reservacion, id_rol, id) VALUES ${placeholders}`,
            flatValues
        );
        return result.affectedRows; // Retorna el número de filas afectadas
    } catch (error) {
        console.error("Error al crear los invitados de la reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}

const createReservaFamiliaresDB = async (id_reserva, familiaresReserva, db_connection) => {
    const executor = db_connection || pool;
    try {
        const values = familiaresReserva.map(familiar => [id_reserva, familiar.id_rol ,familiar.id_familiar]);
        const placeholders = values.map(() => '(?, ?, ?)').join(', ');
        const flatValues = values.flat();
        const [result] = await executor.execute(
            `INSERT INTO reservaciones_invitados (id_reservacion, id_rol, id) VALUES ${placeholders}`,
            flatValues
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
    getInvitadosPorReservaDB,
    createReservaDB,
    createReservaHorasDB,
    createInvitadoDB,
    createInvitadosEnReservaDB,
    createReservaFamiliaresDB
};