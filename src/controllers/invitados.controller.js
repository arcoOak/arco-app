import {
    getCantidadInvitadosPorUsuarioMesDB,
    removeInvitadoByIdDB,
    removeInvitadoFromReservaDB,
    createInvitadoDB,
    createReservaInvitadosDB
} from '../models/invitado.model.js';

import pool from '../config/db.config.js';

const getCantidadInvitadosPorUsuarioMes = async (req, res) => {
    const { id_usuario, mes } = req.params;
    try {
        if (!id_usuario || !mes) {
            return res.status(400).json({ message: 'El ID del usuario y el mes son requeridos.' });
        }
        const cantidad = await getCantidadInvitadosPorUsuarioMesDB(id_usuario, mes);
        res.json({ cantidad_invitados: cantidad });
    } catch (error) {
        console.error('Error al obtener la cantidad de invitados por usuario y mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la cantidad de invitados por usuario y mes' });
    }
}

const removeInvitado = async (req, res) => {
    const { id_reserva , id_invitado } = req.params;
    const connection = await pool.getConnection(); 
    try {
        await connection.beginTransaction();

        if (!id_invitado || !id_reserva) {
            return res.status(400).json({ message: 'El ID de la reserva y el ID del invitado es requerido.' });
        }

        // Primero se elimina la relación en la tabla intermedia
        const resultEliminarReservaInvitado = await removeInvitadoFromReservaDB(id_reserva, id_invitado, connection);

        // Luego se elimina el invitado de la tabla principal
        const resultEliminarInvitado = await removeInvitadosByIdDB(id_invitado, connection);
        

        if (!resultEliminarReservaInvitado) { // Solo es crucial verificar que la relación existía
            await connection.rollback();
            return res.status(404).json({ message: 'No se encontró el invitado en la reserva especificada.' });
        }   

        await connection.commit();
        res.json({ message: 'Invitado eliminado exitosamente' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al eliminar los invitados por reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar los invitados por reserva' });
    }
}

const createInvitadoParaReserva = async (req, res) => {
    const { id_reserva, listaInvitados } = req.body;
    try {

        if (!id_reserva || !listaInvitados || listaInvitados.length === 0) {
            return res.status(400).json({ message: 'Los datos de la reserva y la lista de invitados son requeridos.' });
        }

        const resultadoInvitadosReserva = await createReservaInvitadosDB(id_reserva, listaInvitados );

        res.status(201).json({ message: 'Invitados creados exitosamente', resultadoInvitadosReserva, resultadoInvitados });
    } catch (error) {
        console.error('Error al crear los invitados para la reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear los invitados para la reserva' });
    }
}

const createInvitado = async (req, res) => {
    const { invitadoData } = req.body;

    try{
        if (
            !invitadoData || 
            !invitadoData.id_usuario || 
            !invitadoData.nombre || 
            !invitadoData.apellido || 
            !invitadoData.documento_identidad ||
            !invitadoData.correo
        ) {
            return res.status(400).json({ message: 'Los datos del invitado son requeridos.' });
        }

        const nuevoInvitado = await createInvitadoDB(invitadoData);
        res.status(201).json({ message: 'Invitado creado exitosamente', id_invitado: nuevoInvitado });
    } catch (error) {
        console.error('Error al crear el invitado:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el invitado' });
    }

}

export default {
    getCantidadInvitadosPorUsuarioMes,
    removeInvitado,
    createInvitadoParaReserva,
    createInvitado
};