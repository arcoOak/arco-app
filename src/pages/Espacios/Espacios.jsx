import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Espacios.css'; // Asegúrate de importar tu CSS principal

import { useDragToScroll } from '../../hooks/useDragToScroll';

import LoadingModal from '../../components/modals/LoadingModal';
import CategoriaSelector from '../../components/CategoriaSelector'; // Importa el componente de carrusel de categorías

import espacioService from '../../services/espacio.service';

import comercioImagePlaceholder from '../../assets/comercio_placeholder.webp';

import { useAuth } from '../../context/AuthContext';

import BuscadorTexto from '../../components/BuscadorTexto'; // Importa el componente de buscador de texto

export default function Espacios() {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState(0); // To highlight the active category
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const {user, isDarkTheme} = useAuth();

    const [loading, setLoading] = useState(false);

    //Datos a Cargar

    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [espacios, setEspacios] = useState([]);

    // Drag to scroll hook

    const { scrollContainerRef, dragHandlers } = useDragToScroll();
  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{

                const [categorias, espaciosData] = await Promise.all([
                    espacioService.getCategoriasEspacioDisponible(user.id_club), 
                    espacioService.getAllEspaciosReservables(user.id_club)
                ]);

                setCategoriasDisponibles(categorias);
                setEspacios(espaciosData);

            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const displayCategorias = useMemo(() => ([
            {
                id_categoria_espacio: 0,
                nombre_categoria_espacio: 'Todos',
                icon_fa: 'fa-store'
            },
            ...categoriasDisponibles
        ]), [categoriasDisponibles]);


    // Función para manejar el clic en "Ver más"
    const handleVerMasClick = (espacioId) => {
        navigate(`/espacios/${espacioId}`);
    };

    // Filtrar negocios basado en la categoría activa y el término de búsqueda

    const filteredEspacios = useMemo(() => {
        if (!espacios) {
            return [];
        }

        let filtered = espacios;

        // Filtrar por categoría activa
        if (activeCategory !== 0) {
            filtered = filtered.filter(
                (espacio) => espacio.id_categoria_espacio === activeCategory
            );
        }

        // Filtrar por término de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(espacio =>
                espacio.nombre_espacio_reservable.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (espacio.descripcion_espacio_reservable && espacio.descripcion_espacio_reservable.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return filtered;
    }, [activeCategory, searchTerm, espacios]);

    return (
        <React.Fragment>
        <LoadingModal visible={loading} />
        <section>
            <h2 className={`mb-2 mt-2 ${isDarkTheme ? 'title-darkMode' : ''}`}>Espacios Reservables</h2>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 p-0">

                        <CategoriaSelector
                            scrollContainerRef={scrollContainerRef}
                            dragHandlers={dragHandlers}
                            displayCategorias={displayCategorias}
                            activeCategory={activeCategory}
                            handleSeleccionarCategoria={setActiveCategory}
                            id="id_categoria_espacio"
                            nombre="nombre_categoria_espacio"
                        />

                        <BuscadorTexto
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Busca el espacio que necesitas"
                        />

                        
                        <div className="espacios p-0">
                            {filteredEspacios.length > 0 ? (
                                filteredEspacios.map((espacio) => (
                                    <div onClick={() => handleVerMasClick(espacio.id_espacio_reservable)} className="espacio-card" key={espacio.id_espacio_reservable}>
                                        <img src={espacio.img || comercioImagePlaceholder} alt={espacio.nombre_espacio_reservable} />
                                        <h3>{espacio.nombre_espacio_reservable}</h3>
                                    </div>
                                ))
                            ) : (
                                <p className={`${isDarkTheme ? 'text-darkMode' : ''}`} style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#777' }}>
                                    No se encontraron espacios reservables para esta búsqueda o categoría.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section >
        </React.Fragment>
    );
}