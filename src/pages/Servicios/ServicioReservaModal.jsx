import React, {useState, useEffect} from 'react';
import './ServicioReservaModal.css';

import {useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import Button from '../../components/buttons/Button'; // Importa el botón de confirmar

export default function ConfirmacionReservaModal({
    visible,
    onClose,
    onConfirm,
    servicio,
    empresaSeleccionada,
    fecha,
    horarios,
    costeTotal,
    nota,
    setNota,
}) {
    if (!visible) {
        return null;
    }

    const { user } = useAuth(); // Obtiene el usuario autenticado desde el contexto
    const [loading, setLoading] = useState(false);

    

    useEffect(() => {


    }, []);


    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatearHorarios = (horarios) => {
        if (!horarios || horarios.length === 0) {
            return [];
        }

        // Sort the array to ensure consecutive hours are next to each other
        const sortedHorarios = [...horarios].sort((a, b) => a - b);
        const result = [];
        let startHour = parseInt(sortedHorarios[0]);
        let endHour = parseInt(sortedHorarios[0]);

        for (let i = 0; i < sortedHorarios.length; i++) {
            const currentHour = parseInt(sortedHorarios[i]);
            const nextHour = parseInt(sortedHorarios[i + 1]);

            if (currentHour + 1 === nextHour) {
            // If the next hour is consecutive, extend the current range
            endHour = nextHour;
            } else {
            // If not consecutive, or if it's the last hour,
            // finalize the current range and add it to the result
            let formattedStart = `${startHour.toString().padStart(2, '0')}:00`;
            let formattedEnd = `${(endHour + 1).toString().padStart(2, '0')}:00`;

            // Handle the case where 23:00 - 00:00 should be 23:00 - 24:00 (or similar)
            if (endHour === 23) {
                formattedEnd = '00:00'; // For 23:00 to 00:00 (next day)
            }

            result.push(`${formattedStart} - ${formattedEnd}`);

            // Reset start and end for the next potential range
            if (nextHour !== undefined) {
                startHour = nextHour;
                endHour = nextHour;
            }
            }
        }
        return result;
        };
    
    //console.log( 'formatearHorarios', formatearHorarios(horarios) );

    

    return (
        <React.Fragment>
        <div className="modal-overlay">
            <div className="modal-content">

                <h2 className='reserva-modal__title'>Confirmar Servicio</h2>

                <div className='modal-content-block'>

                <div className='reserva-modal__info'>
                    <p className='reserva-modal__text'><strong>Servicio:</strong> {servicio?.nombre_servicio_reservable}</p>
                
                    {empresaSeleccionada && <p className='reserva-modal__text'><strong>Empresa:</strong> {empresaSeleccionada.nombre_comercio}</p>}
                </div>

                <div className='reserva-modal__info'>
                    <p className='reserva-modal__text'><strong>Fecha:</strong> {formatearFecha(fecha)}</p>

                    <p className='reserva-modal__text'><strong>Horarios:</strong></p>
                    <ul className='reserva-modal__horarios'>
                        {formatearHorarios(horarios).map((horario, index) => (
                            <li key={index}>{horario}</li>
                        ))}
                    </ul>
                </div>

                <div className='reserva-modal__info'>
                    <p className='reserva-modal__text'><strong>Coste Total:</strong> ${costeTotal}</p>
                </div>

                <div className="form-group">
                    <label htmlFor="nota">Añadir una nota (opcional)</label>
                    <textarea
                        id="nota"
                        value={nota}
                        className='reserva-modal__textarea'
                        onChange={(e) => setNota(e.target.value)}
                        rows="3"
                        placeholder="Instrucciones especiales, etc."
                    />
                </div>

                </div>

                <div className="modal-actions">

                    <Button
                        className='primary'
                        onClick={onConfirm}
                        disabled={loading}
                    >
                    
                        {loading ? 'Procesando...' : 'Confirmar'}
                    </Button>
                    <Button onClick={onClose} className="neutral" disabled={loading}>
                        Cancelar
                    </Button>

                </div>
            </div>
        </div>
        </React.Fragment>
    );
}

