import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import './your-component-styles.css'; // Asegúrate de importar tu CSS principal

import './Servicios.css'; // Importa el CSS específico para este componente

import LoadingModal from '../../components/modals/LoadingModal';

import { useDragToScroll } from '../../hooks/useDragToScroll'; // Importa el hook personalizado para arrastrar y desplazar

import serviciosService from '../../services/servicios.service';

import servicioImagePlaceholder from '../../assets/comercio_placeholder.webp';

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import BuscadorTexto from '../../components/BuscadorTexto';

// Si usas este componente Servicios, la lista 'allBusinesses' DEBE ser pasada como una prop
export default function Servicios() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [categoriasActivas, setCategoriasActivas] = useState([]);
    const [servicios, setServicios] = useState([]);

    const { scrollContainerRef, dragHandlers } = useDragToScroll();

    const { user } = useAuth(); // Obtén el usuario del contexto de autenticación

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Obtener categorías activas
                const [categorias, servicioData] = await Promise.all([
                    serviciosService.getCategoriasServiciosActivos(user.id_club), 
                    serviciosService.getTodosServicios(user.id_club)]
                );
                
                setCategoriasActivas(categorias);
                setServicios(servicioData);

                // if (categorias.length > 0) {
                //     // Establecer la primera categoría como activa por defecto
                //     setActiveCategory(categorias[0].id_categoria_comercio);
                // }

            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchInitialData();
    }, []);
    const [activeCategory, setActiveCategory] = useState(0); // To highlight the active category

    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    // Función para manejar el clic en "Ver más"
    const handleVerMasClick = (serviciosId) => {
        navigate(`/servicios/${serviciosId}`);
    };

    const handleSeleccionarCategoria = (categoriaId) => {
        console.log('Categoría seleccionada:', categoriaId);
        setActiveCategory(categoriaId);
    };

    // Creamos una lista de categorías para mostrar que incluye "Todos"
    const displayCategorias = useMemo(() => [
        {
            id_categoria_servicio: 0,
            nombre_categoria_servicio: 'Todos',
            icon_fa: 'fa-store'
        },
        ...categoriasActivas
    ], [categoriasActivas]);



    // Filtrar negocios basado en la categoría activa y el término de búsqueda
    const filteredBusinesses = useMemo(() =>{
        // Si no hay servicios o no hay categoría activa, no mostramos nada.

        let businesses = servicios;

    // 1. Si hay una categoría activa (diferente de 0), filtramos por ella.
        if(activeCategory != 0 ){
            businesses = servicios.filter(
                (business) => business.id_categoria_servicio === activeCategory
            );
        }

    // 2. Si hay un término de búsqueda, filtramos el resultado anterior.
        if (searchTerm) {
            businesses = businesses.filter(business =>
                business.nombre_servicio_reservable.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (business.descripcion && business.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return businesses;
    }, [activeCategory, searchTerm, servicios]);



    return (
        <React.Fragment>
            <LoadingModal visible={loading}></LoadingModal>
        <section>
            <h2 className='mb-2 mt-2'>Servicios Disponibles</h2>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 p-0">
                        <div
                            className="categorias"
                            ref={scrollContainerRef}
                            {...dragHandlers}
                        >

                        {displayCategorias.map((cat) => (
                                <button
                                    key={cat.id_categoria_servicio}
                                    className={`span-categoria ${activeCategory === cat.id_categoria_servicio ? 'active' : ''}`}
                                    onClick={() => handleSeleccionarCategoria(cat.id_categoria_servicio)}
                                >
                                    <i className={`fa ${cat.icon_fa}`}></i> {cat.nombre_categoria_servicio}
                                </button>
                            ))}
                        </div>

                        <BuscadorTexto
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Busca el servicio que necesitas"
                        />
                        <div className="servicios p-0">
                            {filteredBusinesses.length > 0 ? (
                                filteredBusinesses.map((servicio) => (
                                    <div className="servicio-card" key={servicio.id_servicio_reservable} onClick={() => handleVerMasClick(servicio.id_servicio_reservable)}>
                                        <img src={servicio.img || servicioImagePlaceholder} alt={servicio.nombre_servicio_reservable} />
                                        <h3>{servicio.nombre_servicio_reservable}</h3>
                                        {/* <p>{servicio.descripcion_servicio_reservable}</p> */}
                                        {/* <button
                                            className="btn btn-primary comercio-card-button"
                                            onClick={() => handleVerMasClick(comercio.id_comercio)}
                                        >
                                            Ver más
                                        </button> */}
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#777' }}>
                                    No se encontraron servicios para esta búsqueda o categoría.
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