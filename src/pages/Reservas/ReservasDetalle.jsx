import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReservasDetalle.css'; 

import { useAuth } from '../../context/AuthContext';

import LoadingModal from '../../components/modals/LoadingModal';
import reservasService from '../../services/reservas.service';

import ButtonVolver from '../../components/buttons/ButtonVolver';



export default function ReservasDetalle() {
    const navigate = useNavigate();

    const { user } = useAuth(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    //Datos a Cargar

    const [reservaDetalle, setReservaDetalle] = useState(null);
    const [listaInvitados, setListaInvitados] = useState([]);
    const [listaHoras, setListaHoras] = useState([]);

  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const mesActual = new Date().getMonth() + 1; // Obtener el mes actual (1-12)
                const [reserva, invitados, horas] = await Promise.all([
                    reservasService.getReservaById(id),
                    reservasService.getInvitadosPorReserva(id),
                    reservasService.getHorasReservadasPorReserva(id)
                ]);

                console.log(reserva);

                setReservaDetalle(reserva);
                setListaInvitados(invitados);
                setListaHoras(horas);


            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

        const formatearHorarios = (horarios) => {
            if (!horarios || horarios.length === 0) {
                return [];
            }

            horarios = horarios.map(h => parseInt( h.hora_reserva.slice(0, 2), 10) ); // Asegúrate de que todos los horarios sean enteros

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

    const handleNavigate = (path, id) =>{
        navigate(`/${path}/${id}`, { state: { returnTo: location.pathname } });
    }


    return (
        <React.Fragment>
        <LoadingModal visible={loading} />

        <ButtonVolver to="/reservas" className="boton-volver" />

        <div className="reservas-detalle-container">
            <div className="reservas-detalle-header">
            <h2>Detalle de Reserva</h2>
            {reservaDetalle ? (
                <div className="reserva-info">
                    <div className='reserva-info-header'>
                        <h3>Información de la Reserva</h3>

                        <div className='info-card-link' onClick={() => handleNavigate('espacios', reservaDetalle.id_espacio_reservable)}>
                            <div className='info-card-link__text'>
                                <span className='info-card-link__label'>Espacio Reservado</span>
                                <span className='info-card-link__value'>{reservaDetalle.nombre_espacio_reservable}</span>
                                <span className='info-card-link__subvalue'>{reservaDetalle.nombre_unidad}</span>
                            </div>
                            <i className='bx bx-chevron-right info-card-link__icon'></i>
                        </div>

                        <p><strong>Fecha Reserva:</strong> {new Date(reservaDetalle.fecha_reservacion).toLocaleDateString()}</p>
                        <p><strong>Cantidad de Horas Reservadas:</strong> {listaHoras.length}</p>
                    </div>
                    <div className='reserva-info-details'>
                        <h3>Detalles del Espacio</h3>
                        <p><strong>Descripción:</strong> <br/> {reservaDetalle.descripcion}</p>
                        <p><strong>Capacidad:</strong> {reservaDetalle.capacidad}</p>
                        <p><strong>Coste por Hora:</strong> ${reservaDetalle.costo_reserva}</p>
                        <p><strong>Ubicación:</strong> {reservaDetalle.ubicacion}</p>
                    </div>
                </div>
            
                
            ) : (
                <p className='loading-text'>Cargando detalles de la reserva...</p>
            )}
            </div>

            <div className='horas-reservadas'>
            <h3>Horas Reservadas</h3>
            {listaHoras.length > 0 ? (
                <ul className='horas-list'>
                    {formatearHorarios(listaHoras).map((hora, index) => (
                        <li key={index}>{hora}</li>
                    ))}
                </ul>
            ) : (
                <p>No hay horas reservadas para esta reserva.</p>
            )}
            </div>

            <div className='invitados-reservados'>
            <h3>Invitados</h3>
            {listaInvitados.length > 0 ? (
                <ul className="invitados-list">
                    {listaInvitados.map((invitado) => (
                        <li key={invitado.id_rol+"_"+invitado.id}>
                            {invitado.nombre_invitado} ({invitado.tipo_invitado})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay invitados para esta reserva.</p>
            )}
            </div>

            
        </div>
        
        
        </React.Fragment>
    );
}