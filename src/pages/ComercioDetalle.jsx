// src/components/ComercioDetalle.jsx (o ComercioDetalle.js)
import React, {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/ComercioDetalle.css'; // Crea un archivo CSS para este componente


import comercioService from '../services/comercio.service'; // Importa el servicio de comercios
import LoadingModal from '../components/modals/LoadingModal';

import comercioImagePlaceholder from '../assets/comercio_placeholder.avif';

export default function ComercioDetalle() { // Recibe allBusinesses como prop
    const { id } = useParams(); // Obtiene el ID del comercio de la URL
    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [loading, setLoading] = useState(false); // Estado para manejar la carga de datos
    const [comercio, setComercio] = useState(null);

    useEffect(() => {
        setLoading(true); // Inicia la carga de datos
        // Aquí podrías hacer una llamada a la API para obtener los detalles del comercio por ID
        const fetchComercio = async () => {
            try {
                // Simula una llamada a la API para obtener el comercio por ID
                const comercioData = await comercioService.getComercioById(id);
                if (!comercioData) {
                    throw new Error('Comercio no encontrado');
                }
                setComercio(comercioData);
            } catch (error) {
                console.error('Error fetching comercio:', error);
                setComercio(null); // Si hay un error, establecemos comercio como null
            }
            setLoading(false); // Finaliza la carga de datos
        };

        fetchComercio();
    }, []);


    return (

        <React.Fragment>
        <LoadingModal visible={loading}></LoadingModal>
        <div className="detalle-container">
            <button className="back-button" onClick={() => navigate('/comercios')}>
                <i className='bx bx-arrow-back'></i> Volver
            </button>

            <div className="detalle-header">
                <img src={`../${comercio.img || comercioImagePlaceholder}`} alt={comercio.nombre_comercio} className="detalle-img" />
                <h1>{comercio.name}</h1>
                <p className="detalle-description">{comercio.descripcion_comercio}</p>
            </div>

            <div className="detalle-info-section">
                <h2>Información de Contacto</h2>
                <p><strong>Horario:</strong> Lunes a Viernes: {comercio.hora_apertura} - ${comercio.hora_cierre}  | Sábado y Domingo: 10:00 AM - 10:00 PM</p>
                <p><strong>Teléfono:</strong> <a href={`tel:${comercio.phone || '+584123456789'}`}>{comercio.phone || '+58-412-3456789'}</a></p>
                {/* Puedes añadir más información aquí como dirección, redes sociales, etc. */}
            </div>

            <div className="detalle-catalogo-section">
                <h2>Catálogo de Productos</h2>
                <div className="productos-grid">
                    {dummyProducts.map(product => (
                        <div className="producto-card" key={product.id}>
                            <img src={product.img} alt={product.name} className="producto-img" />
                            <h3 className="producto-name">{product.name}</h3>
                            <p className="producto-description">{product.description}</p>
                            <span className="producto-price">{product.price}</span>
                            <button className="add-to-cart-button">Añadir</button>
                        </div>
                    ))}
                    {dummyProducts.length === 0 && <p className="no-products">No hay productos disponibles en este momento.</p>}
                </div>
            </div>
        </div>
        </React.Fragment>
    );
}