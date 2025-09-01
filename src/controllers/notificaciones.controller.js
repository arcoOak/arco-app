import { Notificacion } from "../models/Notificacion.js";

import {pool} from '../config/db.config.js';

const getAllNotificaciones = async (req, res) => {
    const { id_usuario } = req.params;
    let connection
    try {
        connection = await pool.getConnection();
        const notificaciones = await Notificacion.getAllNotificaciones(id_usuario, connection);
        if (!notificaciones || notificaciones.length === 0) {
            return res.status(404).json({ message: 'No hay Notificaciones disponibles' });
        }
        //console.log('Notificaciones Controller:', notificaciones);
        res.status(200).json(notificaciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las Notificaciones', error: error.message });
    }finally {
        if (connection) connection.release();
    }

}

const marcarNotificacionComoVista = async(req, res) =>{
    const { id_notificacion } = req.params;
    let connection;
    try{

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const notificacion = await Notificacion.getNotificacionPorId(id_notificacion, connection);

        if (!notificacion) {
            await connection.rollback();
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        console.log('Notificacion a marcar como vista:', notificacion);
        // Se pasa el `id_notificacion` de los parámetros de la ruta para evitar el error 'undefined',
        // ya que la propiedad en el objeto `notificacion` podría no llamarse `id_notificacion`.
        await notificacion.marcarComoVista(connection);
        await connection.commit();
        res.status(200).json({ message: 'Notificación marcada como vista' });
    } catch (error) {
        // Asegurarse de que la conexión existe antes de hacer rollback
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Error al marcar la Notificación como vista', error: error.message });
    }finally {
        if (connection) connection.release();
    }
}

const crearNotificacion = async (req, res) =>{
    const { 
        id_usuario, 
        id_club, 
        fecha_activacion_notificacion, 
        estado_visualizacion,
        id_categoria_notificacion, 
        id_tipo_transaccion, 
        id_asociado } = req.body;

    let connection;
    try {
        connection = await pool.getConnection();
        const notificacion = new Notificacion({
            id_usuario,
            id_club,
            fecha_activacion_notificacion,
            estado_visualizacion,
            id_categoria_notificacion,
            id_tipo_transaccion,
            id_asociado
        });
        const result = await notificacion.save(connection);
        res.status(201).json({ message: 'Notificación creada', notificacion: result });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la Notificación', error });
    }finally {
        if (connection) connection.release();
    }
}



export default {
    getAllNotificaciones,
    marcarNotificacionComoVista,
    crearNotificacion
}