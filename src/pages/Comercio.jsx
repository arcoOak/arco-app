import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './your-component-styles.css'; // Asegúrate de importar tu CSS principal

// Si usas este componente Comercio, la lista 'allBusinesses' DEBE ser pasada como una prop
export default function Comercio({ allBusinesses }) {
    const navigate = useNavigate();

    // State for categories
    const initialCategories = [
        { name: 'Comida', icon: 'bx-burger-alt' },
        { name: 'Cafetería', icon: 'bx-coffee-cup' },
        { name: 'Heladería', icon: 'bx-icecream' },
        { name: 'Panadería', icon: 'bx-baguette' },
        { name: 'Farmacia', icon: 'bx-plus-medical' },
        { name: 'Librería', icon: 'bx-book' },
        { name: 'Ropa', icon: 'bx-t-shirt' },
    ];
    const [categories, setCategories] = useState(initialCategories);
    const [activeCategory, setActiveCategory] = useState('Comida'); // To highlight the active category
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
    const handleVerMasClick = (comercioId) => {
        navigate(`/comercio/${comercioId}`);
    };

    // Filtrar negocios basado en la categoría activa y el término de búsqueda
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);

    useEffect(() => {
        // Asegúrate de que allBusinesses no sea undefined o null antes de filtrar
        if (!allBusinesses) {
            setFilteredBusinesses([]);
            return;
        }

        const businessesByCategory = allBusinesses.filter(
            (business) => business.category === activeCategory
        );

        const finalFiltered = businessesByCategory.filter(business =>
            business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            business.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBusinesses(finalFiltered);
    }, [activeCategory, searchTerm, allBusinesses]); // ¡Importante: allBusinesses debe ser una dependencia!


    return (
        <div className="container-fluid">
            <h2 className="mt-2 mb-3">Tiendas Disponibles</h2>
            <div className="row">
                <div className="col-md-12">
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
                            placeholder="Busca la tienda que necesitas"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="comercios">
                        {filteredBusinesses.length > 0 ? (
                            filteredBusinesses.map((comercio) => (
                                <div className="comercio-card" key={comercio.id}>
                                    <img src={comercio.img} alt={comercio.name} />
                                    <h3>{comercio.name}</h3>
                                    <p>{comercio.description}</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleVerMasClick(comercio.id)}
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
    );
}