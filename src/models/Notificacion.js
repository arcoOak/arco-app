import {pool} from '../config/db.config.js';

import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js';

import {
    getNotificacionByIdDB,
    getAllNotificacionesDB,
    updateEstadoNotificacionVisualizacionDB,
    createNotificacionDB
} from './notificaciones.model.js';

class Notificacion {
    constructor(
        { 
            id_usuario, 
            id_club, 
            fecha_activacion_notificacion,
            estado_visualizacion,
            id_categoria_notificacion, 
            id_tipo_transaccion, 
            id_asociado,
            id_notificacion
            
        }
    ) {
        this.id_usuario = id_usuario;
        this.id_club = id_club;
        this.fecha_activacion_notificacion = fecha_activacion_notificacion;
        this.estado_visualizacion = estado_visualizacion;
        this.id_categoria_notificacion = id_categoria_notificacion;
        this.id_tipo_transaccion = id_tipo_transaccion;
        this.id_asociado = id_asociado;
        this.id_notificacion = id_notificacion;
    }

    async save(connection) {
        try{
            const notificationData = {
                id_usuario: this.id_usuario,
                id_club: this.id_club,
                fecha_activacion_notificacion: this.fecha_activacion_notificacion,
                estado_visualizacion: this.estado_visualizacion,
                id_categoria_notificacion: this.id_categoria_notificacion,
                id_tipo_transaccion: this.id_tipo_transaccion,
                id_asociado: this.id_asociado
            }
            const result = await createNotificacionDB(notificationData, connection);
            const notificacionNueva = await this.getNotificacionPorId(result, connection);
            this.id_notificacion = result;
            return notificacionNueva;
        } catch (error) {
            console.error('Error al guardar la Notificación:', error);
            throw error;
        }
    }

    
    async marcarComoVista(connection) {
        try {
            const result = await updateEstadoNotificacionVisualizacionDB(this.id_notificacion, connection);
            return result;
        } catch (error) {
            console.error('Error al marcar la Notificación como vista:', error);
            throw error;
        }
    }

    static async getNotificacionPorId(id_notificacion, connection) {
        try {
            //console.log('ID de la Notificación:', id_notificacion);
            const notificacion = await getNotificacionByIdDB(id_notificacion, connection);
            const notificationData = {
                id_usuario: notificacion.id_usuario, 
                id_club: notificacion.id_club, 
                fecha_activacion_notificacion: notificacion.fecha_activacion_notificacion,
                estado_visualizacion: notificacion.estado_visualizacion,
                id_categoria_notificacion: notificacion.id_categoria_notificacion, 
                id_tipo_transaccion: notificacion.id_tipo_transaccion, 
                id_asociado: notificacion.id_asociado,
                id_notificacion: notificacion.id_notificacion
            }
            const notificationObject = new Notificacion(notificationData);
            return notificationObject;
        } catch (error) {
            console.error('Error al obtener la Notificación por ID:', error);
            throw error;
        }
    }

    static async getAllNotificaciones(id_usuario, connection) {
        try {
            //console.log('ID del Usuario:', id_usuario);
            const notificaciones = await getAllNotificacionesDB(id_usuario, connection);
            return notificaciones;
        } catch (error) {
            console.error('Error al obtener todas las Notificaciones:', error);
            throw error;
        }
    }

}

export { Notificacion }