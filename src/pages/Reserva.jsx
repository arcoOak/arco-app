import React, {useState} from 'react';
import { Link } from 'react-router-dom'; // <-- Agrega esta línea
import './Reserva.css'; // Asegúrate de tener un archivo CSS para estilos



const limitarLetras = (texto, limite) => {
    if (texto.length > limite) {
        return texto.substring(0, limite) + '...';
    }
    return texto;
}


const Reserva = () => {

    const [reservas, setReservas] = useState([
        { 
            id_espacio: 1, 
            nombre_espacio: "Reserva 1", 
            descripcion: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            capacidad: 10,
            costo: 50,
            src: 'src/assets/field.webp'
         },
        { 
            id_espacio: 2, 
            nombre_espacio: "Reserva 2", 
            descripcion: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            capacidad: 20,
            costo: 100,
            src: 'src/assets/field.webp'
         },
        // ...puedes agregar más reservas aquí
    ]);
    
    return (
        <div className="page-container">
            <h2 className="page-title">Reservas</h2>
            <p>Aquí puedes ver o gestionar tus reservas.</p>

            <div className="espacios_lista">
                {reservas.map((reserva, idx) => (
                    <Link 
                        to={`/reservas/${reserva.id_espacio}`}
                        key={reserva.id_espacio}
                    >

                    <div 
                        className='espacios_lista_item' 
                        key={reserva.id_espacio}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                        <div style={{ backgroundImage: `url(${reserva.src})` }} className='espacios_lista_item_image'>
                            <h3 className='espacios_lista_item_title'>
                                {reserva.nombre_espacio}
                            </h3>
                        </div>

                        <div className='espacios_lista_item_content'>
                            <p className='espacios_lista_item_description'>
                                {limitarLetras(reserva.descripcion, 50)}
                            </p>
                            <p className='espacios_lista_item_capacity'>
                                <b>Capacidad:</b> {reserva.capacidad} {reserva.capacidad === 1 ? 'persona' : 'personas'}
                            </p>
                        </div>
                    </div>
                    </Link>
                ))
                }
            </div>
        </div>
    );
}

export default Reserva;