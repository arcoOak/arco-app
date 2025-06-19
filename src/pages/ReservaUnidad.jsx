import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import './ReservaUnidad.css';

import SmallIconBox from '../components/boxes/SmallIconBox';
import CalendarioSeleccionable from '../components/calendary/CalendarioSeleccionable'; 
import HorarioSeleccionable from '../components/calendary/HorarioSeleccionable'; // Asegúrate de tener este componente

// Datos de ejemplo, reemplaza por fetch o contexto si tienes backend


const ReservaUnidad = () => {

    const [selectedDate, setSelectedDate] = useState(null); // Nuevo estado


    const [reservas, setReservas] = useState([
            { 
                id_espacio: 1, 
                nombre_espacio: "Reserva 1", 
                descripcion: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                capacidad: 10,
                costo: 50,
                src: '../src/assets/field.webp'
             },
             { 
                id_espacio: 2, 
                nombre_espacio: "Reserva 2", 
                descripcion: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                capacidad: 20,
                costo: 100,
                src: '../src/assets/field.webp'
            },
        ]);

    const { id } = useParams();// Extrae el ID de la URL
    const reserva = reservas.find(r => r.id_espacio === Number(id));// Busca la reserva por ID

    if (!reserva) {
        return <div className="reserva-unidad-container">No se encontró la reserva.</div>;
    }

    return (
        <div className="reserva-unidad">
            <div className="reserva-unidad-container">
                <div 
                    className="reserva-unidad-image"
                    style={{ backgroundImage: `url(${reserva.src})` }}
                />
                <h2>{reserva.nombre_espacio}</h2>
                <p><b>Descripción:</b> {reserva.descripcion}</p>
            </div>

            <div className="reserva-unidad-container-row">

                <div className="reserva-unidad-icons">
                    <SmallIconBox 
                        titulo="Capacidad" 
                        icono="fa-users" 
                        dato={ reserva.capacidad === 1 ? `${reserva.capacidad} persona` : `${reserva.capacidad} personas`}  />
                </div>
                <div className="reserva-unidad-icons">
                    <SmallIconBox 
                    titulo="Costo" 
                    icono="fa-money-bill-wave" 
                    dato={`${reserva.costo}$`} />
                </div>
            </div>

            <div className="reserva-unidad-container">
                <CalendarioSeleccionable 
                    canchaId={reserva.id_espacio} 
                    titulo={'Disponibilidad de Reserva'} 
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
                {selectedDate && (
                    <div className="reserva-unidad-container">
                        <HorarioSeleccionable fecha={selectedDate} />
                    </div>
                )}
            </div>

            

        </div>
    );
};

export default ReservaUnidad;