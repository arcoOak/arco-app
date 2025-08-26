import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reservas.css'; // Asegúrate de importar tu CSS principal

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación}

import LoadingModal from '../../components/modals/LoadingModal';

import reservasService from '../../services/reservas.service';

import MesSelector from '../../components/MesSelector'; // Importa el componente MesSelector

export default function Reservas() {
    const navigate = useNavigate();

    const { user } = useAuth(); // Obtén el usuario autenticado del contexto

    const [loading, setLoading] = useState(false);

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1); // Estado para el mes seleccionado

    //Datos a Cargar

    const [listaReservas, setListaReservas] = useState([]);

    // Drag to scroll hook

  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const mesActual = new Date().getMonth() + 1; // Obtener el mes actual (1-12)
                const reservas = await reservasService.getReservaByUsuarioMes(user.id_socio, mesActual )
                console.log('Reservas obtenidas:', reservas);
                setListaReservas(reservas);

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
            try {
                const reservas = await reservasService.getReservaByUsuarioMes(user.id_socio, mes);
                console.log('Reservas obtenidas para el mes seleccionado:', reservas);
                setListaReservas(reservas);
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
            <h2 className='reservas-title' >Reservas</h2>

            <MesSelector
                mesSeleccionado={mesSeleccionado}
                handleMesSeleccionado={(mes) => handleMesSeleccionado(mes)}
            />


            <div className="reservas-list" >
                <div className="reservas-list-inner">
                    
                    {listaReservas.length > 0 ? (
                        listaReservas.map((reserva) => (
                            <div onClick={() => navigate(`/reservas/${reserva.id_reservacion}`)} className="reserva-item" key={reserva.id_reservacion}>
                                <div className="reserva-item-header">
                                    <h3 className="reserva-item-title">{reserva.nombre_espacio_reservable}</h3>
                                    <span className="reserva-item-date">{reserva.nombre_unidad}</span>
                                </div>
                                <div className="reserva-item-details">
                                    <p className="reserva-item-date">Fecha: {new Date(reserva.fecha_reservacion).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-reservas">
                            <p>No tienes reservas activas para esta fecha.</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
        </React.Fragment>
    );
}