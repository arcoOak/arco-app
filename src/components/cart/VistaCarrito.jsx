import React, { useMemo } from 'react';
import { useCarrito } from '../../context/CartContext';

function VistaCarrito() {
    // Obtenemos todo lo que necesitamos del contexto
    const { elementosCarrito, removeFromCarrito, updateCantidad, limpiarCarrito } = useCarrito();

    // Calculamos el total. Usamos useMemo para optimizar y que no se recalcule en cada render.
    const total = useMemo(() => {
        return elementosCarrito.reduce((acc, item) => acc + (item.precio_producto * item.cantidad), 0);
    }, [elementosCarrito]);

    if (elementosCarrito.length === 0) {
        return <div>Tu carrito está vacío.</div>;
    }

    return (
        <div>
            <h2>Tu Carrito</h2>
            <ul>
                {elementosCarrito.map(item => (
                    <li key={item.id_producto}>
                        <span>{item.nombre_producto} - ${item.precio_producto.toFixed(2)}</span>
                        <div>
                            {/* Botones para actualizar cantidad */}
                            <button onClick={() => updateCantidad(item.id_producto, -1)}>-</button>
                            <span> Cantidad: {item.cantidad} </span>
                            <button onClick={() => updateCantidad(item.id_producto, 1)}>+</button>
                        </div>
                        {/* Botón para eliminar */}
                        <button onClick={() => removeFromCarrito(item.id_producto)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            <h3>Total: ${total.toFixed(2)}</h3>
            <button onClick={limpiarCarrito}>Limpiar Carrito</button>
            <button>Proceder al Pago</button> {/* Este te llevará a la página de checkout */}
        </div>
    );
}

export default VistaCarrito;