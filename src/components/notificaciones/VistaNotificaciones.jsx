import React, { useState } from 'react';

import { useNavigate } from "react-router-dom"; 

import {useNotificaciones} from '../../context/NotificacionesContext';

import './VistaNotificaciones.css'; 

import LoadingModal from '../modals/LoadingModal'; // Asegúrate de que este componente exista

import { useAuth } from '../../context/AuthContext';

import {TIPOS_NOTIFICACION} from '../../constants/notificacion.constants';

const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);
    return fechaFormateada;
};

function VistaNotificaciones({onClose}) {
    // Obtenemos todo lo que necesitamos del contexto
    const { notificaciones, marcarComoVista } = useNotificaciones();

    const { user } = useAuth();

    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        onClose();
    }

    const handleMarcarComoVista = async (notificacion) => {
        console.log(notificacion);

        try {
            if (!notificacion.estado_visualizacion) {
                await marcarComoVista(notificacion.id_notificacion);
            }
            

            switch (notificacion.id_categoria_notificacion)
            {
                case TIPOS_NOTIFICACION.PAGO_MENSUALIDAD_PENDIENTE:
                    navigate(`/transaccion/${notificacion.id_billetera_transaccion}`, { state: { backLocation: '/' } });
                    break;
                case TIPOS_NOTIFICACION.PAGO_RESERVACION_PENDIENTE:
                    navigate(`/transaccion/${notificacion.id_billetera_transaccion}`, { state: { backLocation: '/' } });
                    break;
                case TIPOS_NOTIFICACION.PAGO_COMPRA_COMERCIO_PENDIENTE:
                    navigate(`/transaccion/${notificacion.id_billetera_transaccion}`, { state: { backLocation: '/' } });
                    break;
                case TIPOS_NOTIFICACION.PAGO_SERVICIO_PENDIENTE:
                    navigate(`/transaccion/${notificacion.id_billetera_transaccion}`, { state: { backLocation: '/' } });
                    break;
                case TIPOS_NOTIFICACION.CONFIRMACION_RESERVACION:
                    navigate(`/reservas/${notificacion.id_asociado}`, { state: { backLocation: '/' } });
                    break;
                case TIPOS_NOTIFICACION.RECARGA_VALIDA:
                    navigate(`/transaccion/${notificacion.id_billetera_transaccion}`, { state: { backLocation: '/' } });
                    break;
                case TIPOS_NOTIFICACION.RECARGA_NEGADA:
                    navigate(`/transaccion/${notificacion.id_billetera_transaccion}`, { state: { backLocation: '/' } });
                    break;
                case TIPOS_NOTIFICACION.RECARGA_EN_VALIDACION:
                    navigate(`/transaccion/${notificacion.id_billetera_transaccion}`, { state: { backLocation: '/' } });
                    break;
                default:
                    break;
            }


        } catch (error) {
            console.error("Error al marcar la notificación como vista:", error);
            // Opcional: Mostrar un modal de error al usuario
        } finally {
            
            onClose(); // Cierra el modal después de la acción
            
            
        }
    };

    return (
        <React.Fragment>
        <LoadingModal visible={loading} />
        <div className="vista-notificacion-overlay" onClick={handleClose}>
            <div className="vista-notificacion" onClick={(e) => e.stopPropagation()}>
                <div className="vista-notificacion-header">
                    <i className='fa fa-bell'></i>
                    <h2 className='vista-notificacion-title'>Notificaciones</h2>
                    <button className="vista-notificacion-cerrar" onClick={handleClose}>&times;</button>
                </div>
                <ul className='vista-notificacion-lista'>
                    {notificaciones.length > 0 ?

                    notificaciones.map(item => (
                        <li 
                            key={item.id_notificacion} 
                            className={`vista-notificacion-item ${!item.estado_visualizacion ? 'no-visto' : ''}`}
                            onClick={() => handleMarcarComoVista(item)}
                        >
                            <i className='vista-notificacion-icon fa fa-info-circle'></i>

                            <div className='vista-notificacion-contenido'>
                                <span className='vista-notificacion-titulo'>{item.nombre_transaccion}</span>
                                <span className='vista-notificacion-comercio'>{item.nombre_categoria_notificacion}</span>
                                <span className='vista-notificacion-fecha'>{formatearFecha(item.fecha_activacion_notificacion)}</span>
                            </div>
                            
                        </li>
                    )) : 

                    (
                        <li className='vista-carrito-item vista-notificacion-vacio'>
                            <p>No hay notificaciones.</p>
                        </li>
                    )
                
                }
                </ul>
                
            </div>
        </div>
        </React.Fragment>
    );
}

export default VistaNotificaciones;