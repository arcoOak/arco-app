import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import './your-component-styles.css'; // Asegúrate de importar tu CSS principal

import './Comercio.css'; // Importa el CSS específico para este componente

import LoadingModal from '../../components/modals/LoadingModal';

import { useDragToScroll } from '../../hooks/useDragToScroll'; // Importa el hook personalizado para arrastrar y desplazar

import comercioService from '../../services/comercio.service'; // Importa el servicio de comercios

import comercioImagePlaceholder from '../../assets/comercio_placeholder.webp';

// Si usas este componente Comercio, la lista 'allBusinesses' DEBE ser pasada como una prop
export default function Comercio() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [categoriasActivas, setCategoriasActivas] = useState([]);
    const [comercios, setComercios] = useState([]);

    const { scrollContainerRef, dragHandlers } = useDragToScroll();

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Obtener categorías activas
                const [categorias, comerciosData] = await Promise.all([
                    comercioService.getCategoriasComercioActivos(), comercioService.getComerciosActivos()]
                );
                
                setCategoriasActivas(categorias);
                setComercios(comerciosData);

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
    const handleVerMasClick = (comercioId) => {
        navigate(`/comercio/${comercioId}`);
    };

    const handleSeleccionarCategoria = (categoriaId) => {
        console.log('Categoría seleccionada:', categoriaId);
        setActiveCategory(categoriaId);
    };

    // Creamos una lista de categorías para mostrar que incluye "Todos"
    const displayCategorias = useMemo(() => [
        {
            id_categoria_comercio: 0,
            nombre_categoria_comercio: 'Todos',
            icon_fa: 'fa-store'
        },
        ...categoriasActivas
    ], [categoriasActivas]);



    // Filtrar negocios basado en la categoría activa y el término de búsqueda
    const filteredBusinesses = useMemo(() =>{
        // Si no hay comercios o no hay categoría activa, no mostramos nada.

        let businesses = comercios;

    // 1. Si hay una categoría activa (diferente de 0), filtramos por ella.
        if(activeCategory != 0 ){
            businesses = comercios.filter(
                (business) => business.id_categoria_comercio === activeCategory
            );
        }

    // 2. Si hay un término de búsqueda, filtramos el resultado anterior.
        if (searchTerm) {
            businesses = businesses.filter(business =>
                business.nombre_comercio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (business.descripcion_comercio && business.descripcion_comercio.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return businesses;
    }, [activeCategory, searchTerm, comercios]);



    return (
        <React.Fragment>
            <LoadingModal visible={loading}></LoadingModal>
        <section>
            <h2 className='mb-2 mt-2'>Tiendas Disponibles</h2>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 p-0">
                        <div
                            className="categorias"
                            ref={scrollContainerRef}
                            onMouseDown={dragHandlers.onMouseDown}
                            onMouseLeave={dragHandlers.onMouseLeave}
                            onMouseUp={dragHandlers.onMouseUp}
                            onMouseMove={dragHandlers.onMouseMove}
                        >

                        {displayCategorias.map((cat) => (
                                <button
                                    key={cat.id_categoria_comercio}
                                    className={`span-categoria ${activeCategory === cat.id_categoria_comercio ? 'active' : ''}`}
                                    onClick={() => handleSeleccionarCategoria(cat.id_categoria_comercio)}
                                >
                                    <i className={`fa ${cat.icon_fa}`}></i> {cat.nombre_categoria_comercio}
                                </button>
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
                        <div className="comercios p-0">
                            {filteredBusinesses.length > 0 ? (
                                filteredBusinesses.map((comercio) => (
                                    <div className="comercio-card" key={comercio.id_comercio} onClick={() => handleVerMasClick(comercio.id_comercio)}>
                                        <img src={comercio.img || comercioImagePlaceholder} alt={comercio.nombre_comercio} />
                                        <h3>{comercio.nombre_comercio}</h3>
                                        {/* <p>{comercio.descripcion_comercio}</p> */}
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
                                    No se encontraron tiendas para esta búsqueda o categoría.
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