import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Agrega esta línea
import './Reserva.css'; // Asegúrate de tener un archivo CSS para estilos

import ButtonsRow from '../components/buttons/ButtonsRow'; // Asegúrate de que la ruta sea correcta


const limitarLetras = (texto, limite) => {
    if (texto.length > limite) {
        return texto.substring(0, limite) + '...';
    }
    return texto;
}


const Reserva = () => {
    const navigate = useNavigate();

    const [reservas, setReservas] = useState([
        { 
            id_espacio: 1, 
            nombre_espacio: "Reserva 1", 
            descripcion: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            capacidad: 10,
            costo: 50,
            categoria: 1,
            src: 'src/assets/field.webp'
         },
        { 
            id_espacio: 2, 
            nombre_espacio: "Reserva 2", 
            descripcion: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            capacidad: 20,
            costo: 100,
            categoria: 2,
            src: 'src/assets/field.webp'
         },
         { 
            id_espacio: 3, 
            nombre_espacio: "Reserva 3", 
            descripcion: "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            capacidad: 5,
            costo: 30,
            categoria: 1,
            src: 'src/assets/field.webp'
         },
    ]);

    const [categoriasReservas, setCategoriasReservas] = useState([
        { id: 1, nombre: "Deportes" },
        { id: 2, nombre: "Eventos" },
        { id: 3, nombre: "Reuniones" },
    ])

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);


    const buttons = categoriasReservas.map(categoria => ({
        label: categoria.nombre,
        onClick: () => {
            setCategoriaSeleccionada(categoria.id);
        },  
        className: categoriaSeleccionada === categoria.id ? 'active' : ''
    }))

    const reservasFiltradas = categoriaSeleccionada
        ? reservas.filter(r => r.categoria === categoriaSeleccionada)
        : reservas;

    
    return (
        <div className="page-container">
            <h2 className="page-title">Reservas</h2>
            <p>Aquí puedes ver o gestionar tus reservas.</p>

            <ButtonsRow buttons={buttons} />

            <div className="espacios_lista">
                {reservasFiltradas.length === 0 && (
                    <p>No hay reservas para esta categoría.</p>
                )}
                {reservasFiltradas.map((reserva, idx) => (
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