import React, {useState, useEffect} from 'react';
import './ReservaModal.css';

import {useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación


import familiaresService from '../../services/familiares.service'; // Importa el servicio de familiares

export default function ConfirmacionReservaModal({
    visible,
    onClose,
    onConfirm,
    espacio,
    unidadSeleccionada,
    fecha,
    horarios,
    costeTotal,
    nota,
    setNota,
    invitados,
    setInvitados,
}) {
    if (!visible) {
        return null;
    }

    const { user } = useAuth(); // Obtiene el usuario autenticado desde el contexto
    const [loading, setLoading] = useState(false);
    const [listaFamiliares, setListaFamiliares] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                
                const familiaresList = await familiaresService.getBeneficiariosBySocioId(user.id_usuario);
                console.log('Beneficiarios:', familiaresList);
                setListaFamiliares(familiaresList);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        } 

        fetchData();

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

    const handleAnadirInvitado = (invitadoReservacion, id_rol) => {
        const invitado = { id_familiar: invitadoReservacion.id_familiar, id_rol: id_rol };
        if (!invitados.some(inv => inv.id_familiar === invitado.id_familiar)) {
            setInvitados([...invitados, invitado]);
        }else{
            // Si el familiar ya está en la lista, lo eliminamos
            setInvitados(invitados.filter(inv => inv.id_familiar !== invitadoReservacion.id_familiar));
        }
    };

    const familiarYaAgregado = (invitadoReservacion) => {
        return invitados.some(inv => inv.id_familiar === invitadoReservacion.id_familiar);
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <h2 className='reserva-modal__title'>Confirmar Reserva</h2>

                <div className='reserva-modal__info'>
                    <p className='reserva-modal__text'><strong>Espacio:</strong> {espacio?.nombre_espacio_reservable}</p>
                
                    {unidadSeleccionada && <p className='reserva-modal__text'><strong>Unidad:</strong> {unidadSeleccionada.nombre_unidad}</p>}
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

                <div className="form-group">
                    <label htmlFor="invitados">Seleccione Invitados (opcional)</label>
                    <div className="reserva-modal__invitados">
                        {
                            listaFamiliares.length > 0 && (
                                listaFamiliares.map((familiar) => (
                                    <div 
                                        key={familiar.id_familiar} 
                                        className={`reserva-modal__invitado ${familiarYaAgregado(familiar) ? 'seleccionado' : ''}`}
                                        onClick={() => handleAnadirInvitado(familiar, 3)}
                                    >
                                        <p>
                                            {familiar.nombre} <br/> {familiar.apellido}
                                        </p>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onConfirm} className="button-primary" disabled={loading}>
                        {loading ? 'Procesando...' : 'Confirmar'}
                    </button>
                    <button onClick={onClose} className="button-secondary" disabled={loading}>
                        Cancelar
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

