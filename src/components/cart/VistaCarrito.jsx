import React, { useMemo, useState } from 'react';
import { useCarrito } from '../../context/CartContext';

import './VistaCarrito.css'; 

import ConfirmarModal from '../modals/ConfirmarModal';

import hamburguesaPlaceholder from '../../assets/hamburguesa.png'; // Asegúrate de que la ruta sea correcta

function VistaCarrito({onClose}) {
    // Obtenemos todo lo que necesitamos del contexto
    const { elementosCarrito, removeFromCarrito, updateCantidad, limpiarCarrito } = useCarrito();

    const [showConfirmarModal, setShowConfirmarModal] = useState(false);

    // Calculamos el total. Usamos useMemo para optimizar y que no se recalcule en cada render.
    const total = useMemo(() => {
        return elementosCarrito.reduce((acc, item) => acc + (item.precio_producto * item.cantidad), 0);
    }, [elementosCarrito]);

    const handleClose = () => {
        onClose();
    }

    if (elementosCarrito.length === 0) {
        return (
            <div className="vista-carrito-overlay" onClick={handleClose}>
                <div className="vista-carrito vista-carrito-vacio" onClick={(e) => e.stopPropagation()}>
                    <div className="vista-carrito-header">
                        <i className='fa fa-shopping-cart'></i>
                        <h2 className='vista-carrito-title'>Tu Carrito</h2>
                        <button className="vista-carrito-cerrar" onClick={onClose}>&times;</button>
                    </div>
                    <p className='vista-carrito-mensaje'>Tu carrito está vacío.</p>
                </div>
            </div>
        );
    }

    const handleLimpiarCarrito = () => {
        limpiarCarrito();
        setShowConfirmarModal(false);
    }

    const confirmLimpiarCarrito = () => {
        setShowConfirmarModal(true);
    }
    

    return (
        <React.Fragment>
        <ConfirmarModal visible={showConfirmarModal} onConfirm={handleLimpiarCarrito} onCancel={() => setShowConfirmarModal(false)} mensaje={'¿Está seguro de eliminar todos los elementos del Carrito?'}></ConfirmarModal>
        <div className="vista-carrito-overlay" onClick={handleClose}>
            <div className="vista-carrito" onClick={(e) => e.stopPropagation()}>
                <div className="vista-carrito-header">
                    <i className='fa fa-shopping-cart'></i>
                    <h2 className='vista-carrito-title'>Tu Carrito</h2>
                    <button className="vista-carrito-cerrar" onClick={onClose}>&times;</button>
                </div>
                <ul className='vista-carrito-lista'>
                    {elementosCarrito.map(item => (
                        <li key={item.id_producto} className='vista-carrito-item'>
                            <img className='vista-carrito-imagen' src={ hamburguesaPlaceholder} alt={item.nombre_producto} />
                            <span>{item.nombre_producto} - ${item.precio_producto.toFixed(2)}</span>
                            <div className='controles-cantidad'>
                                {/* Botones para actualizar cantidad */}
                                <button onClick={() => updateCantidad(item.id_producto, -1)}>-</button>
                                <span> Cantidad: {item.cantidad} </span>
                                <button onClick={() => updateCantidad(item.id_producto, 1)}>+</button>
                                <button className='boton-eliminar' onClick={() => removeFromCarrito(item.id_producto)}>
                                    <i className='fa fa-trash'></i> 
                                </button>
                            </div>
                            {/* Botón para eliminar */}
                            
                        </li>
                    ))}
                </ul>
                <div className='vista-carrito-footer'>
                    <h3 className='vista-carrito-total'>Total: ${total.toFixed(2)}</h3>
                    <div className='vista-carrito-acciones'>
                        <button className='vista-carrito-boton-pagar'>Proceder al Pago</button> {/* Este te llevará a la página de checkout */}
                        <button className='vista-carrito-boton-limpiar' onClick={confirmLimpiarCarrito}>Limpiar Carrito</button>
                    </div>
                </div>
            </div>
        </div>
        </React.Fragment>
    );
}

export default VistaCarrito;