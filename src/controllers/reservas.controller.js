import {
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
} from '../models/reservas.model.js';

import pool from '../config/db.config.js';

const getReservaById = async (req, res) => {
    const { id_reserva } = req.params;
    try {
        if (!id_reserva) {
            return res.status(400).json({ message: 'El ID de reserva es requerido.' });
        }
        const data = await getReservaByIdDB(id_reserva);
        if (!data) {
            return res.status(404).json({ message: 'Reserva no encontrada.' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error al obtener la reserva por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la reserva por ID' });
    }
}

const getReservasByEspacioUnidad = async (req, res) => {
    const { id_espacio } = req.params;
    try {
        if (!id_espacio) {
            return res.status(400).json({ message: 'El ID del espacio es requerido.' });
        }
        const reservas = await getReservasByEspacioUnidadDB(id_espacio);
        
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservas por espacio:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservas por espacio' });
    }
}

const getReservasPorUsuario = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        if (!id_usuario) {
            return res.status(400).json({ message: 'El ID del usuario es requerido.' });
        }
        const reservas = await getReservasPorUsuarioDB(id_usuario);
        
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservas por usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservas por usuario' });
    }
}

const getReservasByEspacioUnidadMes = async (req, res) => {
    const { id_espacio, mes } = req.params;
    try {
        if (!id_espacio || !mes) {
            return res.status(400).json({ message: 'El ID del espacio y el mes son requeridos.' });
        }
        const reservas = await getReservasByEspacioUnidadMesDB(id_espacio, mes);
        
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservas por espacio y mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservas por espacio y mes' });
    }
}

const getReservaByUsuarioMes = async (req, res) => {
    const { id_usuario, mes } = req.params;
    try {
        if (!id_usuario || !mes) {
            return res.status(400).json({ message: 'El ID del usuario y el mes son requeridos.' });
        }
        const reservas = await getReservaByUsuarioMesDB(id_usuario, mes);
        
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservas por usuario y mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservas por usuario y mes' });
    }
}

const getHorasReservadasPorUnidadFecha = async (req, res) => {
    const { id_unidad, fecha } = req.params;
    try {
        if (!id_unidad || !fecha) {
            return res.status(400).json({ message: 'El ID de la unidad y la fecha son requeridos.' });
        }
        const horasReservadas = await getHorasReservadasPorUnidadFechaDB(id_unidad, fecha);
        
        res.json(horasReservadas);
    } catch (error) {
        console.error('Error al obtener las horas reservadas por unidad y fecha:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las horas reservadas por unidad y fecha' });
    }
}

const getHorasReservadasPorReserva = async (req, res) => {
    const { id_reserva } = req.params;
    try {
        if (!id_reserva) {
            return res.status(400).json({ message: 'El ID de la reserva es requerido.' });
        }
        const horasReservadas = await getHorasReservadasPorReservaDB(id_reserva);
        
        res.json(horasReservadas);
    } catch (error) {
        console.error('Error al obtener las horas reservadas por reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las horas reservadas por reserva' });
    }
}

const createReserva = async (req, res) => {
    // Es crucial obtener una conexión del pool para manejar la transacción
    const connection = await pool.getConnection(); 
    
    try {
        const { reservaData, listaInvitados, listaHoras } = req.body;

        // Iniciar la transacción
        await connection.beginTransaction();

        // 1. Crear la reserva principal
        // Pasamos 'connection' a todas las funciones de DB para que usen la misma transacción
        const newReserva = await createReservaDB(reservaData, connection);

        const idReserva = newReserva;

        // 2. Insertar las horas de la reserva (si existen)
        if (listaHoras && listaHoras.length > 0) {
            await createReservaHorasDB(idReserva, listaHoras, connection);
        }

        // 3. Insertar los invitados de la reserva (si existen)
        if (listaInvitados && listaInvitados.length > 0) {
            await createReservaInvitadosDB(idReserva, listaInvitados, connection);
        }

        // Si todo fue exitoso, confirmar la transacción
        await connection.commit();

        res.status(201).json(newReserva);
    } catch (error) {
        // Si hay cualquier error, revertir todos los cambios
        await connection.rollback(); 

        console.error('Error al crear la reserva (transacción revertida):', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la reserva' });
    } finally {
        // Siempre liberar la conexión al pool al final
        if (connection) {
            connection.release();
        }
    }
}

export default {
    getReservaById,
    getReservasByEspacioUnidad,
    getReservasPorUsuario,
    getReservasByEspacioUnidadMes,
    getReservaByUsuarioMes,
    getHorasReservadasPorUnidadFecha,
    getHorasReservadasPorReserva,
    createReserva
};