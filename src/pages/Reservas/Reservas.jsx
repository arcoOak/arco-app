import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reservas.css'; // Asegúrate de importar tu CSS principal

import { useDragToScroll } from '../../hooks/useDragToScroll';

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación}

import LoadingModal from '../../components/modals/LoadingModal';

import reservasService from '../../services/reservas.service';

export default function Reservas() {
    const navigate = useNavigate();

    const { user } = useAuth(); // Obtén el usuario autenticado del contexto

    const [loading, setLoading] = useState(false);

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1); // Estado para el mes seleccionado

    //Datos a Cargar

    const [listaReservas, setListaReservas] = useState([]);

    // Drag to scroll hook

    const { scrollContainerRef, dragHandlers } = useDragToScroll();
    const monthsRef = useRef({});
  
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
     useEffect(() => {
        const selectedMonthElement = monthsRef.current[mesSeleccionado];

        if (selectedMonthElement) {
            selectedMonthElement.scrollIntoView({
                behavior: 'smooth', // Para una animación suave
                inline: 'center',  // Centra el elemento horizontalmente
                block: 'nearest'   // Evita el scroll vertical innecesario
            });
        }
    }, [mesSeleccionado]);

    const listaMeses = useMemo(() => {
        return [
            {
                nombre: 'Enero',
                numero: 1
            },
            {
                nombre: 'Febrero',
                numero: 2
            },
            {
                nombre: 'Marzo',
                numero: 3
            },
            {
                nombre: 'Abril',
                numero: 4
            },
            {
                nombre: 'Mayo',
                numero: 5
            },
            {
                nombre: 'Junio',
                numero: 6
            },
            {
                nombre: 'Julio',
                numero: 7
            },
            {
                nombre: 'Agosto',
                numero: 8
            },
            {
                nombre: 'Septiembre',
                numero: 9
            },
            {
                nombre: 'Octubre',
                numero: 10
            },
            {
                nombre: 'Noviembre',
                numero: 11
            },
            {
                nombre: 'Diciembre',
                numero: 12
            }
        ];
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
            <div className="meses-list" ref={scrollContainerRef} {...dragHandlers}>
                <div className="meses-list-inner">
                    { listaMeses.map((mes) => (
                        <div 
                            className={`meses-item ${mesSeleccionado === mes.numero ? 'active' : ''}`} 
                            key={mes.numero} 
                            ref = { (element) => monthsRef.current[mes.numero] = element }
                            onClick={() => handleMesSeleccionado(mes.numero)}
                        >
                            <p className="meses-item-nombre">{mes.nombre}</p>
                        </div>
                    ))
                    }

                </div>
            </div>
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
                            <p>No tienes reservas activas.</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
        </React.Fragment>
    );
}