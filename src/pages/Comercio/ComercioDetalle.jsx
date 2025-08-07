// src/components/ComercioDetalle.jsx (o ComercioDetalle.js)
import React, {useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './ComercioDetalle.css'; // Crea un archivo CSS para este componente


import comercioService from '../../services/comercio.service'; // Importa el servicio de comercios
import productoService from '../../services/producto.service';
import LoadingModal from '../../components/modals/LoadingModal';
import ExitosoModal from '../../components/modals/ExitosoModal';

import comercioImagePlaceholder from '../../assets/comercio_placeholder.webp';
import productoImagePlaceholder from '../../assets/producto_placeholder.webp';
import hamburguesaPlaceholder from '../../assets/hamburguesa.png';
import aguaPlaceholder from '../../assets/agua.jpg';

import { useDragToScroll } from '../../hooks/useDragToScroll';

import { useCarrito } from '../../context/CartContext';

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

export default function ComercioDetalle() { // Recibe allBusinesses como prop
    const { id } = useParams(); // Obtiene el ID del comercio de la URL
    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [loading, setLoading] = useState(false); // Estado para manejar la carga de datos
    const [comercio, setComercio] = useState({});
    const [productos, setProductos] = useState([]); // Estado para manejar los productos del comercio
    const [categorias, setCategorias] = useState([]); // Estado para manejar las categorías de productos

    const [activeCategory, setActiveCategory] = useState(0);

    const [showExitosoModal, setShowExitosoModal] = useState(false); // Estado para manejar el modal de éxito

    const { addToCarrito, isProductoEnCarrito } = useCarrito(); // Hook para manejar el carrito de compras

    const { scrollContainerRef, dragHandlers } = useDragToScroll();

    useEffect(() => {
        setLoading(true); // Inicia la carga de datos
        // Aquí podrías hacer una llamada a la API para obtener los detalles del comercio por ID
        const fetchData = async () => {
            setLoading(true)
            try {

                const [comercioData, productosData, categoriasData] = await Promise.all([
                    comercioService.getComercioById(id),
                    productoService.getProductosPorComercio(id),
                    productoService.getCategoriasDeProductosPorComercio(id)
                ]);

                console.log('Comercio Data:', comercioData);
                console.log('Productos Data:', productosData);
                console.log('Categorías Data:', categoriasData);

                if (!comercioData) {
                    console.error('Comercio no encontrado');
                    setComercio(null); // Si no se encuentra el comercio, establecemos comercio como null
                }else{
                    setComercio(comercioData);
                }
                
                setProductos(productosData || []);
                setCategorias(categoriasData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setComercio(null); // Si hay un error, establecemos comercio como null
                setProductos([]); // Si hay un error, establecemos productos como un array vacío
                setCategorias([]); // Si hay un error, establecemos categorías como un array vacío
            } finally {
                setLoading(false);
            }
             // Finaliza la carga de datos
        };
        fetchData();
    }, [id]);

    const handleAddToCarrito = (producto)=>{
        addToCarrito(producto);
        setShowExitosoModal(true); // Muestra el modal de éxito
        setTimeout(() => {
            setShowExitosoModal(false); // Oculta el modal después de un tiempo
        }, 2000);

    }

    const displayCategorias = useMemo(() => [
            {
                id_categoria_producto: 0,
                nombre_categoria_producto: 'Todos',
            },
            ...categorias
        ], [categorias]);

    const handleSeleccionarCategoria = (categoriaId) => {
        console.log('Categoría seleccionada:', categoriaId);
        setActiveCategory(categoriaId);
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



    if (!comercio) {
        return (
            <div className="detalle-container">
                <button className="back-button" onClick={() => navigate('/comercios')}>
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
        <div className="detalle-container">
            <button className="back-button" onClick={() => navigate('/comercios')}>
                <i className='bx bx-arrow-back'></i> Volver
            </button>

            <div className="detalle-header">
                <img src={`${comercio.img || comercioImagePlaceholder}`} alt={comercio.nombre_comercio} className="detalle-img" />
                <h1>{comercio.nombre_comercio}</h1>
                <p className="detalle-description">{comercio.descripcion_comercio}</p>
            </div>

            <div className="detalle-info-section">
                <h2>Información de Contacto</h2>
                <p>
                    <strong>Horario:</strong> 
                    <br />
                    Lunes a Viernes: {comercio.hora_apertura ? comercio.hora_apertura.slice(0,5) : '--:--'} - {comercio.hora_cierre ? comercio.hora_cierre.slice(0,5) : '--:--'} 
                </p>
                <p><strong>Teléfono:</strong> <a href={`tel:${comercio.telefono || '+584123456789'}`}>{comercio.telefono || '+58-412-3456789'}</a></p>
                {/* Puedes añadir más información aquí como dirección, redes sociales, etc. */}
            </div>

            <div className="detalle-catalogo-section">
                <h2>Catálogo de Productos</h2>

                <div
                            className="categorias-productos"
                            ref={scrollContainerRef}
                            {...dragHandlers}
                        >

                        {displayCategorias.map((cat) => (
                                <button
                                    key={cat.id_categoria_producto}
                                    className={`span-categoria-productos ${activeCategory === cat.id_categoria_producto ? 'active' : ''}`}
                                    onClick={() => handleSeleccionarCategoria(cat.id_categoria_producto)}
                                >
                                    {cat.nombre_categoria_producto}
                                </button>
                            ))}
                </div>

                <div className="productos-grid">
                    { 
                    productosFiltrados.map(producto => (
                         <ProductoCard producto={producto} handleAddToCarrito={handleAddToCarrito} key={producto.id_producto} productoEnCarrito={isProductoEnCarrito(producto.id_producto)} />
                    ))
                    }
                    {productosFiltrados.length === 0 && <p className="no-products">No hay productos disponibles en este momento.</p>} 
                </div>
            </div>
        </div>
        </React.Fragment>
    );
}