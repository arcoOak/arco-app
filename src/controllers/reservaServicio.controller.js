import {pool} from '../config/db.config.js';

import {
    getReservaServicioByIdDB,
    getReservasServicioPorServicioDB,
    getReservasServicioPorServicioYMesDB,
    getReservasServicioPorSocioDB,
    getReservasServicioPorSocioYMesDB,
    getHorasReservadasPorServicioPorFechaDB,
    getHorasReservadasPorReservaServiciosDB,
    createReservaServicioDB,
    createReservaServicioHorasDB
} from '../models/reservaServicio.model.js';

import { TransaccionReservaServicio } from '../models/Transaccion.js';

const getReservaServicioById = async (req, res) => {
    const { id_reservacion_servicio } = req.params;
    try {
        if (!id_reservacion_servicio) {
            return res.status(400).json({ message: 'El ID de la reservación de servicio es requerido.' });
        }
        const data = await getReservaServicioByIdDB(id_reservacion_servicio);
        if (!data) {
            return res.status(404).json({ message: 'Reservación de servicio no encontrada.' });
        }
        res.json(data);
    } catch (error) {
        console.error('Error al obtener la reservación de servicio por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la reservación de servicio por ID' });
    }
}

const getReservasServicioPorServicio = async (req, res) => {
    const { id_club, id_servicio } = req.params;
    try {
        if (!id_servicio || !id_club) {
            return res.status(400).json({ message: 'El ID del servicio es requerido.' });
        }
        const reservas = await getReservasServicioPorServicioDB(id_servicio, id_club);
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservaciones de servicio por servicio:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservaciones de servicio por servicio' });
    }
}

const getReservasServicioPorServicioYMes = async (req, res) => {
    const { id_servicio, id_club, mes, anho } = req.params;
    try {
        if (!id_servicio || !id_club || !mes || !anho) {
            return res.status(400).json({ message: 'El ID del servicio, club, mes y año son requeridos.' });
        }
        const reservas = await getReservasServicioPorServicioYMesDB(id_servicio, id_club, mes, anho);
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservaciones de servicio por servicio y mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservaciones de servicio por servicio y mes' });
    }
}

const getReservasServicioPorSocio = async (req, res) => {
    const { id_socio, id_club } = req.params;
    try {
        if (!id_socio || !id_club) {
            return res.status(400).json({ message: 'El ID del socio y del club son requeridos.' });
        }
        const reservas = await getReservasServicioPorSocioDB(id_socio, id_club);
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservaciones de servicio por socio:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservaciones de servicio por socio' });
    }
}

const getReservasServicioPorSocioYMes = async (req, res) => {
    const { id_socio, id_club, mes, anho } = req.params;
    try {
        if (!id_socio || !id_club || !mes || !anho) {
            return res.status(400).json({ message: 'El ID del socio, mes y año son requeridos.' });
        }
        
        const reservas = await getReservasServicioPorSocioYMesDB(id_socio, id_club, mes, anho);
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservaciones de servicio por socio y mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservaciones de servicio por socio y mes' });
    }
}

const getHorasReservadasPorServicioPorFecha = async (req, res) => {
    const { id_servicio, fecha, id_club} = req.params;
    try {
        if (!id_servicio || !fecha) {
            return res.status(400).json({ message: 'El ID del servicio y la fecha son requeridos.' });
        }
        const horasReservadas = await getHorasReservadasPorServicioPorFechaDB(id_servicio, fecha, id_club);
        res.json(horasReservadas);
    } catch (error) {
        console.error('Error al obtener las horas reservadas por servicio y fecha:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las horas reservadas por servicio y fecha' });
    }
}

const getHorasReservadasPorReservaServicios = async (req, res) => {
    const { id_reserva_servicio } = req.params;
    try {
        if (!id_reserva_servicio) {
            return res.status(400).json({ message: 'El ID de la reserva de servicio es requerido.' });
        }
        const horasReservadas = await getHorasReservadasPorReservaServiciosDB(id_reserva_servicio);
        res.json(horasReservadas);
    } catch (error) {
        console.error('Error al obtener las horas reservadas por reserva de servicio:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las horas reservadas por reserva de servicio' });
    }
}

const createReservaServicioTransaccion = async (req, res) => {
    const { reservaServicioData, transaccionData, listaHoras, id_usuario } = req.body;

    try {
        const transaccion = new TransaccionReservaServicio({
            id_usuario: id_usuario,
            id_billetera: transaccionData.id_billetera,
            id_tipo_transaccion: transaccionData.id_tipo_transaccion,
            monto: transaccionData.monto,
            reservaServicioData,
            listaHoras
        });

        await transaccion.save();

        res.status(201).json({ message: 'Reserva de servicio creada exitosamente', id_reserva: transaccion.id_pago_asociado });
    } catch (error) {
        console.error('Error al crear la reserva de servicio:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la reserva de servicio' });
    }
}

export default {
    getReservaServicioById,
    getReservasServicioPorServicio,
    getReservasServicioPorServicioYMes,
    getReservasServicioPorSocio,
    getReservasServicioPorSocioYMes,
    getHorasReservadasPorServicioPorFecha,
    getHorasReservadasPorReservaServicios,
    createReservaServicioTransaccion
}