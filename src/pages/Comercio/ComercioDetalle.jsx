// src/components/ComercioDetalle.jsx (o ComercioDetalle.js)
import React, {useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import './ComercioDetalle.css'; // Crea un archivo CSS para este componente
import '../../css/Concecionario.css';

import comercioService from '../../services/comercio.service'; // Importa el servicio de comercios
import productoService from '../../services/producto.service';
import serviciosService from '../../services/servicios.service';

import LoadingModal from '../../components/modals/LoadingModal';
import ExitosoModal from '../../components/modals/ExitosoModal';
import Button from '../../components/buttons/Button'; // Importa el botón de volver

import comercioImagePlaceholder from '../../assets/comercio_placeholder.webp';
import productoImagePlaceholder from '../../assets/producto_placeholder.webp';
import hamburguesaPlaceholder from '../../assets/hamburguesa.png';
import aguaPlaceholder from '../../assets/agua.jpg';

import { useDragToScroll } from '../../hooks/useDragToScroll';

import { useCarrito } from '../../context/CartContext';

import ButtonVolver from '../../components/buttons/ButtonVolver'; // Importa el botón de volver

const ProductoCard = ({ producto, handleAddToCarrito, productoEnCarrito }) => (
    <div className="producto-card" key={producto.id_producto}
        style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.4)), url(${hamburguesaPlaceholder || productoImagePlaceholder})`
        }}
    >
        {/* Usamos el `producto.img` y el placeholder como fallback */}
        <img src={hamburguesaPlaceholder || productoImagePlaceholder} alt={producto.nombre_producto} className="producto-img" />
        <div className="producto-card-content">
            <h3 className="producto-name">{producto.nombre_producto}</h3>
            <p className="producto-description">{producto.descripcion_producto}</p>
            {/* Es buena práctica formatear el precio, por ejemplo, con toFixed(2) */}
            <span className="producto-price">${Number(producto.precio_producto).toFixed(2)}</span>

            {productoEnCarrito && 
            <span className="producto-anadido">Añadido al Carrito</span>
            }

            {!productoEnCarrito &&
            <button className="add-to-cart-button" onClick={() => handleAddToCarrito(producto)}>
                <i className='fa fa-shopping-cart'></i>
                Añadir al Carrito
            </button>
            }
        </div>
    </div>
);

const ServicioCard = ({ servicio, handleServicioClick }) => (
    <div className="servicio-card" key={servicio.id_servicio_reservable_empresa} onClick={() => handleServicioClick(servicio.id_servicio_reservable)}>
        <h3 className="servicio-name">{servicio.nombre_servicio_reservable}</h3>
        <p className="servicio-description">{servicio.descripcion}</p>
        <span className="servicio-price">${Number(servicio.costo_servicio).toFixed(2)}</span>
    </div>
);

export default function ComercioDetalle() { // Recibe allBusinesses como prop
    const { id } = useParams(); // Obtiene el ID del comercio de la URL
    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [loading, setLoading] = useState(false); // Estado para manejar la carga de datos
    const [comercio, setComercio] = useState({});
    const [productos, setProductos] = useState([]); // Estado para manejar los productos del comercio
    const [categoriasProductos, setCategoriasProductos] = useState([]); // Estado para manejar las categorías de productos

    const [servicios, setServicios] = useState([]); // Estado para manejar los servicios del comercio
    const [categoriasServicios, setCategoriasServicios] = useState([]); // Estado para

    const [activeCategory, setActiveCategory] = useState(0);
    const [activeCategoryServicios, setActiveCategoryServicios] = useState(0);

    const [tipoEmpresa, setTipoEmpresa] = useState(null); // Estado para manejar el tipo de comercio

    const [showExitosoModal, setShowExitosoModal] = useState(false); // Estado para manejar el modal de éxito

    const { addToCarrito, isProductoEnCarrito } = useCarrito(); // Hook para manejar el carrito de compras

    const { scrollContainerRef, dragHandlers } = useDragToScroll();

    const location = useLocation();

    const backLocation = location.state?.returnTo || '/comercios';

    useEffect(() => {
        setLoading(true); // Inicia la carga de datos
        // Aquí podrías hacer una llamada a la API para obtener los detalles del comercio por ID
        const fetchData = async () => {
            setLoading(true)
            try {

                const comercioData = await comercioService.getComercioById(id);

                if (!comercioData) {
                    console.error('Comercio no encontrado');
                    setComercio(null); // Si no se encuentra el comercio, establecemos comercio como null
                }else{
                    setComercio(comercioData);
                }

                if(comercioData.id_tipo_comercio == 1){

                    const [productosData, categoriasData] = await Promise.all([
                        productoService.getProductosPorComercio(id),
                        productoService.getCategoriasDeProductosPorComercio(id)
                    ]);

                    console.log('Productos Data:', productosData);
                    console.log('Categorías Data:', categoriasData);

                    setProductos(productosData || []);
                    setCategoriasProductos(categoriasData || []);

                    setTipoEmpresa(1); // Establece el tipo de comercio como 1 (Comercio de Productos)

                }else if(comercioData.id_tipo_comercio == 2){

                    const [serviciosData, categoriasServiciosData] = await Promise.all([
                        serviciosService.getServiciosPorEmpresaReservadora(id),
                        serviciosService.getCategoriasServiciosActivosPorEmpresaReservadora(id)
                    ]);

                    console.log('Servicios Data:', serviciosData);
                    console.log('Categorías Servicios Data:', categoriasServiciosData);

                    setServicios(serviciosData || []);
                    setCategoriasServicios(categoriasServiciosData || []);

                    setTipoEmpresa(2); // Establece el tipo de comercio como 2 (Comercio de Servicios)

                } else {

                    const [productosData, categoriasData, serviciosData, categoriasServiciosData] = await Promise.all([
                        productoService.getProductosPorComercio(id),
                        productoService.getCategoriasDeProductosPorComercio(id),
                        serviciosService.getServiciosPorEmpresaReservadora(id),
                        serviciosService.getCategoriasServiciosActivosPorEmpresaReservadora(id)
                    ]);


                    setProductos(productosData || []);
                    setCategoriasProductos(categoriasData || []);


                    setServicios(serviciosData || []);
                    setCategoriasServicios(categoriasServiciosData || []);


                    setTipoEmpresa(3); // Establece el tipo de comercio como 3 (Comercio Mixto)

                }

            } catch (error) {
                console.error('Error fetching data:', error);
                setComercio(null); // Si hay un error, establecemos comercio como null
                setProductos([]); // Si hay un error, establecemos productos como un array vacío
                setCategoriasProductos([]); // Si hay un error, establecemos categorías como un array vacío
            } finally {
                setLoading(false);
            }
             // Finaliza la carga de datos
        };
        fetchData();
    }, [id]);

    const handleAddToCarrito = (producto)=>{
        addToCarrito(producto, id);
        setShowExitosoModal(true); // Muestra el modal de éxito
        setTimeout(() => {
            setShowExitosoModal(false); // Oculta el modal después de un tiempo
        }, 1500);

    }

    const handleServicioClick = (idServicio) => {
        // Lógica para manejar el clic en un servicio
        navigate(`/servicios/${idServicio}`, { state: { returnTo: `/comercios/${id}` } });
    }

    const displayCategorias = useMemo(() => [
            {
                id_categoria_producto: 0,
                nombre_categoria_producto: 'Todos',
            },
            ...categoriasProductos
        ], [categoriasProductos]);

    const displayCategoriasServicios = useMemo(() => [
            {
                id_categoria_servicio: 0,
                nombre_categoria_servicio: 'Todos',
            },
            ...categoriasServicios
        ], [categoriasServicios]);


    const handleSeleccionarCategoria = (categoriaId) => {
        //console.log('Categoría seleccionada:', categoriaId);
        setActiveCategory(categoriaId);
    };

    const handleSeleccionarCategoriaServicios = (categoriaId) => {
        //console.log('Categoría seleccionada:', categoriaId);
        setActiveCategoryServicios(categoriaId);
    };


    const productosFiltrados = useMemo(() =>{
            // Si no hay comercios o no hay categoría activa, no mostramos nada.
    
            let productosTotales = productos;

        // 1. Si hay una categoría activa (diferente de 0), filtramos por ella.
            if(activeCategory != 0 ){
                productosTotales = productos.filter(
                    (business) => business.id_categoria_producto === activeCategory
                );
            }
    
        // 2. Si hay un término de búsqueda, filtramos el resultado anterior.
            
            return productosTotales;
        }, [activeCategory, productos]);

    
    const serviciosFiltrados = useMemo(() =>{
            // Si no hay comercios o no hay categoría activa, no mostramos nada.
    
            let serviciosTotales = servicios;

        // 1. Si hay una categoría activa (diferente de 0), filtramos por ella.
            if(activeCategoryServicios != 0 ){
                serviciosTotales = servicios.filter(
                    (servicio) => servicio.id_categoria_servicio === activeCategoryServicios
                );
            }
    
        // 2. Si hay un término de búsqueda, filtramos el resultado anterior.
            
            return serviciosTotales;
        }, [activeCategoryServicios, servicios]);



    if (!comercio) {
        return (
            <div className="reserva-container">
                <button className="back-button" onClick={() => navigate(backLocation)}>
                    <i className='bx bx-arrow-back'></i> Volver
                </button>
                <p className="error-message">Lo sentimos, el comercio que buscas no fue encontrado.</p>
            </div>
        );
    }


    return (

        <React.Fragment>
        <ExitosoModal visible={showExitosoModal} mensaje="Producto Añadido al Carrito"></ExitosoModal>
        <LoadingModal visible={loading}></LoadingModal>

        <div className="reserva-header">
                <div className='boton-volver-container'>
                    <ButtonVolver to={backLocation} className="boton-volver-white" />
                </div>
                
                <div className='reserva-img-wrapper'>
                    <img src={`${comercio.img || comercioImagePlaceholder}`} alt={comercio.nombre_comercio} className="reserva-img" />
                </div>
                <h1>{comercio.nombre_comercio}</h1>
                <p className="reserva-description">{comercio.descripcion_comercio}</p>
            </div>

        <div className="reserva-container">


            <div className="reserva-info-section">
                <h2>Información de Contacto</h2>
                <p>
                    <strong>Horario:</strong> 
                    <br />
                    Lunes a Viernes: {comercio.hora_apertura ? comercio.hora_apertura.slice(0,5) : '--:--'} - {comercio.hora_cierre ? comercio.hora_cierre.slice(0,5) : '--:--'} 
                </p>
                <p><strong>Teléfono:</strong> <a href={`tel:${comercio.telefono || '+584123456789'}`}>{comercio.telefono || '+58-412-3456789'}</a></p>
                {/* Puedes añadir más información aquí como dirección, redes sociales, etc. */}
            </div>

            { productos.length > 0 && servicios.length > 0 && (

                <div className='selector-tipo-empresa'>

                    <button
                        className={`tipo-empresa-button ${tipoEmpresa === 1 ? 'active' : ''}`}
                        onClick={() => setTipoEmpresa(1)}
                    >
                        Productos
                    </button>
                    <button
                        className={`tipo-empresa-button ${tipoEmpresa === 2 ? 'active' : ''}`}
                        onClick={() => setTipoEmpresa(2)}
                    >
                        Servicios
                    </button>

                </div>

            ) }

            {productos.length > 0 && tipoEmpresa === 1 && 
            <div className="reserva-catalogo-section">
                <h2>Catálogo de Productos</h2>

                <SelectorCategorias
                    id={'id_categoria_producto'}
                    nombre = {'nombre_categoria_producto'}
                    displayCategorias={displayCategorias}
                    activeCategory={activeCategory}
                    handleSeleccionarCategoria={handleSeleccionarCategoria}
                    scrollContainerRef={scrollContainerRef}
                    dragHandlers={dragHandlers}
                />

                <div className="productos-grid">
                    { 
                    productosFiltrados.map(producto => (
                         <ProductoCard producto={producto} handleAddToCarrito={handleAddToCarrito} key={producto.id_producto} productoEnCarrito={isProductoEnCarrito(producto.id_producto)} />
                    ))
                    }
                    {productosFiltrados.length === 0 && <p className="no-products">No hay productos disponibles en este momento.</p>} 
                </div>
            </div>}

            {servicios.length > 0 && tipoEmpresa === 2 &&
            <div className="reserva-servicios-section">
                <h2>Catálogo de Servicios</h2>

                <SelectorCategorias
                    id={'id_categoria_servicio'}
                    nombre = {'nombre_categoria_servicio'}
                    displayCategorias={displayCategoriasServicios}
                    activeCategory={activeCategoryServicios}
                    handleSeleccionarCategoria={handleSeleccionarCategoriaServicios}
                    scrollContainerRef={scrollContainerRef}
                    dragHandlers={dragHandlers}
                />

                <div className="servicios-grid">
                    {serviciosFiltrados.map(servicio => (
                        <ServicioCard servicio={servicio} key={servicio.id_servicio_reservable_empresa} handleServicioClick={handleServicioClick} />
                    ))}
                    {serviciosFiltrados.length === 0 && <p className="no-products">No hay servicios disponibles en este momento.</p>}
                </div>
                </div>
            }
    </div>
    </React.Fragment>
    );
}


const SelectorCategorias = ({ id, nombre, displayCategorias, activeCategory, handleSeleccionarCategoria, scrollContainerRef, dragHandlers }) => {
    return (
        <div
            className="categorias-productos"
            ref={scrollContainerRef}
            {...dragHandlers}
            >

                        {displayCategorias.map((cat) => (
                                <button
                                    key={cat[id]}
                                    className={`span-categoria-productos ${activeCategory === cat[id] ? 'active' : ''}`}
                                    onClick={() => handleSeleccionarCategoria(cat[id])}
                                >
                                    {cat[nombre]}
                                </button>
                            ))}
                </div>
    )
}