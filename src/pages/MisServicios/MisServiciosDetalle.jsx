/*

Añadir a consultas de billetera el coste de las reservaciones de servicios

Cambio de contraseña en perfil de usuario

*/ 

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MisServiciosDetalle.css'; 

import { useAuth } from '../../context/AuthContext';

import LoadingModal from '../../components/modals/LoadingModal';

import reservasServicioService from '../../services/reservasServicio.service';

import BotonVolver from '../../components/buttons/ButtonVolver';


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

export default function MisServiciosDetalle() {
    const navigate = useNavigate();

    const { user } = useAuth(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    //Datos a Cargar

    const [miServicioDetalle, setMiServicioDetalle] = useState(null);
    const [listaHoras, setListaHoras] = useState([]);

  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const [servicio, horas] = await Promise.all([
                    reservasServicioService.getReservaServicioById(id),
                    reservasServicioService.getHorasReservadasPorReservaServicios(id)
                ]);

                setMiServicioDetalle(servicio);
                setListaHoras(horas);


            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNavigate = (path, id) =>{
        navigate(`/${path}/${id}`, { state: { returnTo: location.pathname } });
    }

    return (
        <React.Fragment>
        <LoadingModal visible={loading} />

        <BotonVolver to="/mis-servicios" />



        <div className="reservas-detalle-container">
            <div className="reservas-detalle-header">
            <h1>Detalle del Servicio</h1>
            {miServicioDetalle ? (
                <div className="reserva-info">
                    <div className='reserva-info-header'>
                        <h2>Información de la Reserva</h2>
                        <p><strong>Fecha Reserva:</strong> {new Date(miServicioDetalle.fecha_reservacion).toLocaleDateString()}</p>

                        <div className='info-card-link' onClick={() => handleNavigate('comercios', miServicioDetalle.id_comercio)}>
                            <div className='info-card-link__text'>
                                <span className='info-card-link__label'>Prestador del Servicio</span>
                                <span className='info-card-link__value'>{miServicioDetalle.nombre_comercio}</span>
                            </div>
                            <i className='bx bx-chevron-right info-card-link__icon'></i>
                        </div>

                        <div className='info-card-link' onClick={() => handleNavigate('servicios', miServicioDetalle.id_servicio_reservable)}>
                            <div className='info-card-link__text'>
                                <span className='info-card-link__label'>Servicio</span>
                                <span className='info-card-link__value'>{miServicioDetalle.nombre_servicio_reservable}</span>
                            </div>
                            <i className='bx bx-chevron-right info-card-link__icon'></i>
                        </div>

                        <p><strong>Cantidad de Horas Reservadas:</strong> {listaHoras.length}</p>
                    </div>
                    <div className='reserva-info-details'>
                        <h2>Detalles del Servicio</h2>
                        
                        <p><strong>Capacidad:</strong> {miServicioDetalle.capacidad}</p>
                        <p><strong>Coste por Hora:</strong> ${miServicioDetalle.costo_servicio}</p>
                        {miServicioDetalle.nota &&
                            <p><strong>Información Adicional:</strong> <br/> {miServicioDetalle.nota}</p>
                        }
                    </div>
                </div>
            
                
            ) : (
                <p className='loading-text'>Cargando detalles de la reserva...</p>
            )}
            </div>

            <div className='horas-reservadas'>
            <h2>Horas Reservadas</h2>
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

            

            
        </div>
        
        
        </React.Fragment>
    );
}