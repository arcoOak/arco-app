import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MisServicios.css'; // Asegúrate de importar tu CSS principal

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación}

import LoadingModal from '../../components/modals/LoadingModal';

import reservasServicioService from '../../services/reservasServicio.service';

import MesSelector from '../../components/MesSelector'; // Importa el componente MesSelector

export default function MisServicios() {
    const navigate = useNavigate();

    const { user } = useAuth(); // Obtén el usuario autenticado del contexto

    const [loading, setLoading] = useState(false);

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1); // Estado para el mes seleccionado

    //Datos a Cargar

    const [listaMisServicios, setListaMisServicios] = useState([]);

    // Drag to scroll hook

  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const mesActual = new Date().getMonth() + 1; // Obtener el mes actual (1-12)
                const anhoActual = new Date().getFullYear(); // Obtener el año actual
                const misServicios = await reservasServicioService.getReservasServicioPorSocioYMes(
                    user.id_socio, 
                    user.id_club,
                    anhoActual,
                    mesActual,
                )
                console.log('Reservas obtenidas:', misServicios);
                setListaMisServicios(misServicios);

            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    

    const handleMesSeleccionado = (mes) => {
        setMesSeleccionado(mes);

        const fetchReservas = async () => {
            setLoading(true);
            const anhoActual = new Date().getFullYear(); // Obtener el año actual
            try {
                const misServicios = await reservasServicioService.getReservasServicioPorSocioYMes(
                    user.id_socio, 
                    user.id_club,
                    anhoActual,
                    mes
                );
                console.log('Reservas obtenidas para el mes seleccionado:', misServicios);
                setListaMisServicios(misServicios);
            } catch (error) {
                console.error('Error al cargar las reservas del mes seleccionado:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();

    }


    return (
        <React.Fragment>
        <LoadingModal visible={loading} />
        <div className="reservas-container">
            <h2 className='mis-reservas-title' >Servicios Reservados</h2>

            <MesSelector
                mesSeleccionado={mesSeleccionado}
                handleMesSeleccionado={(mes) => handleMesSeleccionado(mes)}
            />


            <div className="reservas-list" >
                <div className="reservas-list-inner">
                    
                    {listaMisServicios.length > 0 ? (
                        listaMisServicios.map((reserva) => (
                            <div 
                                key={reserva.id_reservacion_servicio}
                                onClick={() => navigate(`/mis-servicios/${reserva.id_reservacion_servicio}`)} className="reserva-item">
                                    <div className="reserva-item-header">
                                        <h3 className="reserva-item-title">{reserva.nombre_servicio_reservable}</h3>
                                        <span className="reserva-item-date">{reserva.nombre_comercio}</span>
                                    </div>
                                    <div className="reserva-item-details">
                                        <p className="reserva-item-date">Fecha: {new Date(reserva.fecha_reservacion).toLocaleDateString()}</p>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-reservas">
                            <p>No tienes servicios reservados para esta fecha.</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
        </React.Fragment>
    );
}