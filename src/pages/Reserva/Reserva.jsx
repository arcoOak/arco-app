import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reserva.css'; // Asegúrate de importar tu CSS principal

export default function Reserva({ concesionarios }) {
    const navigate = useNavigate();

    // State for categories
    const initialCategories = [
        { name: 'Deportes', icon: 'bx-tennis-ball' },
        { name: 'Espacios', icon: 'bx-party' },
        { name: 'Parilleras', icon: 'bx-meat' },
    ];
    const [categories, setCategories] = useState(initialCategories);
    const [activeCategory, setActiveCategory] = useState('Deportes'); // To highlight the active category
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    // --- Drag Scrolling Logic for Categories ---
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        e.preventDefault(); // Prevent default behavior to avoid text selection on drag
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
    };

    const onMouseLeave = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const onMouseMove = (e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };
    // --- End Drag Scrolling Logic ---

    // Función para manejar el clic en "Ver más"
    const handleVerMasClick = (reservaId) => {
        navigate(`/reservas/${reservaId}`);
    };

    // Filtrar negocios basado en la categoría activa y el término de búsqueda
    const [filteredReservas, setfilteredReservas] = useState([]);

    useEffect(() => {
        // Asegúrate de que concesionarios no sea undefined o null antes de filtrar
        if (!concesionarios) {
            setfilteredReservas([]);
            return;
        }

        const businessesByCategory = concesionarios.filter(
            (business) => business.category === activeCategory
        );

        const finalFiltered = businessesByCategory.filter(business =>
            business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            business.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setfilteredReservas(finalFiltered);
    }, [activeCategory, searchTerm, concesionarios]);

    return (
        <section>
            <h2 className='mb-2 mt-2'>Reservas</h2>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 p-0">
                        <div
                            className="categorias"
                            ref={scrollContainerRef}
                            onMouseDown={onMouseDown}
                            onMouseLeave={onMouseLeave}
                            onMouseUp={onMouseUp}
                            onMouseMove={onMouseMove}
                        >
                            {categories.map((cat) => (
                                <span
                                    key={cat.name}
                                    className={`span-categoria ${activeCategory === cat.name ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat.name)}
                                >
                                    <i className={`bx ${cat.icon}`}></i> {cat.name}
                                </span>
                            ))}
                        </div>
                        <div className="search-categoria">
                            <button>
                                <i className='bx bx-search-big'></i>
                            </button>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Busca el espacio que necesitas"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="comercios p-0">
                            {filteredReservas.length > 0 ? (
                                filteredReservas.map((reserva) => (
                                    <div className="reserva-card" key={reserva.id}>
                                        <img src={reserva.img} alt={reserva.name} />
                                        <h3>{reserva.name}</h3>
                                        <p>{reserva.description}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleVerMasClick(reserva.id)}
                                        >
                                            Ver más
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#777' }}>
                                    No se encontraron tiendas para esta búsqueda o categoría.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
}