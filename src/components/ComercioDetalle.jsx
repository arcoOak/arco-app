// src/components/ComercioDetalle.jsx (o ComercioDetalle.js)
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/ComercioDetalle.css'; // Crea un archivo CSS para este componente

// Dummy data de productos para demostración
// En una aplicación real, esto vendría de una API o del mismo comercio
const dummyProducts = [
    { id: 1, name: 'Hamburguesa Clásica', description: 'La original con queso y lechuga.', price: 'Bs. 5.50', img: 'https://via.placeholder.com/150/FFC0CB/000000?text=Prod1' },
    { id: 2, name: 'Papas Fritas Grandes', description: 'Crujientes y doradas.', price: 'Bs. 2.00', img: 'https://via.placeholder.com/150/FFFACD/000000?text=Prod2' },
    { id: 3, name: 'Refresco Cola', description: 'Bebida de cola fría.', price: 'Bs. 1.50', img: 'https://via.placeholder.com/150/E0FFFF/000000?text=Prod3' },
    { id: 4, name: 'Sundae Chocolate', description: 'Postre de helado con sirope.', price: 'Bs. 3.00', img: 'https://via.placeholder.com/150/DDA0DD/000000?text=Prod4' },
    { id: 5, name: 'Nuggets de Pollo (6 und)', description: 'Crujientes trozos de pollo.', price: 'Bs. 4.00', img: 'https://via.placeholder.com/150/98FB98/000000?text=Prod5' },
];

export default function ComercioDetalle({ allBusinesses }) { // Recibe allBusinesses como prop
    const { id } = useParams(); // Obtiene el ID del comercio de la URL
    const navigate = useNavigate(); // Hook para navegar programáticamente

    // Buscar el comercio por ID
    const comercio = allBusinesses.find(b => b.id === parseInt(id));

    if (!comercio) {
        return (
            <div className="detalle-container no-comercio">
                <h2>Comercio no encontrado.</h2>
                <button className="back-button" onClick={() => navigate('/comercios')}>Volver a Tiendas</button>
            </div>
        );
    }

    return (
        <div className="detalle-container">
            <button className="back-button" onClick={() => navigate('/comercios')}>
                <i className='bx bx-arrow-back'></i> Volver
            </button>

            <div className="detalle-header">
                <img src={comercio.img} alt={comercio.name} className="detalle-img" />
                <h1>{comercio.name}</h1>
                <p className="detalle-description">{comercio.description}</p>
            </div>

            <div className="detalle-info-section">
                <h2>Información de Contacto</h2>
                <p><strong>Horario:</strong> Lunes a Viernes: 9:00 AM - 9:00 PM | Sábado y Domingo: 10:00 AM - 10:00 PM</p>
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
    );
}