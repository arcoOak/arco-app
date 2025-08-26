import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useCarrito } from '../../context/CartContext';

import './VistaCarrito.css'; 

import ConfirmarModal from '../modals/ConfirmarModal';
import Button from '../buttons/Button';

import LoadingModal from '../modals/LoadingModal'; // Asegúrate de que este componente exista
import ExitosoModal from '../modals/ExitosoModal'; // Asegúrate de que este componente exista

import compraService from '../../services/compra.service';

import { useAuth } from '../../context/AuthContext';
import productosService from '../../services/producto.service'; // Asumimos que este servicio existe

import hamburguesaPlaceholder from '../../assets/hamburguesa.png'; // Asegúrate de que la ruta sea correcta

import {TIPOS_TRANSACCION} from '../../constants/transaccion.constants.js'; // Import

function VistaCarrito({onClose}) {
    // Obtenemos todo lo que necesitamos del contexto
    const { elementosCarrito, removeFromCarrito, updateCantidad, limpiarCarrito } = useCarrito();

    const { user, actualizarSaldoBilletera } = useAuth();

    const [showExitosoModal, setShowExitosoModal] = useState(false);

    const [nota, setNota] = useState('');
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);
    const [itemsNoDisponibles, setItemsNoDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Calculamos el total. Usamos useMemo para optimizar y que no se recalcule en cada render.
    const total = useMemo(() => {
        // Excluimos del cálculo los productos que ya no están disponibles.
        return elementosCarrito
            .filter(item => 
                !itemsNoDisponibles.some(noDisp => 
                    noDisp.id_producto === item.id_producto && String(noDisp.id_comercio) === String(item.id_comercio)))
            .reduce((acc, item) => acc + (item.precio_producto * item.cantidad), 0);
    }, [elementosCarrito, itemsNoDisponibles]);

    //
    const verificarDisponibilidad = useCallback(async () => { // Verificamos la disponibilidad de los productos en el carrito
            if (elementosCarrito.length === 0) {
                return []; // Devolver un array vacío
            }
            try {
                const productosConsultar = elementosCarrito.map(item => ({ id_producto: item.id_producto, id_comercio: item.id_comercio }));

                // Este servicio debería devolver un array de objetos {id_producto, id_comercio} para los productos no disponibles.
                const idsNoDisponibles = await productosService.verificarDisponibilidad(productosConsultar) || [];

                setItemsNoDisponibles(idsNoDisponibles);
                return idsNoDisponibles; // Devolvemos el valor fresco

            } catch (error) {
                console.error("Error al verificar disponibilidad de productos:", error);
                return []; // Devolver un array vacío en caso de error
            } 
        }, [elementosCarrito]);

    useEffect( () => {
        // Al abrir el carrito o si cambia su contenido, verificamos la disponibilidad.

        verificarDisponibilidad();

    }, [verificarDisponibilidad]); // Ahora el useEffect depende de la función memorizada.

    const handleClose = () => {
        onClose();
    }

    

    const handleLimpiarCarrito = () => {
        limpiarCarrito();
        setShowConfirmarModal(false);
    }

    const confirmLimpiarCarrito = () => {
        setShowConfirmarModal(true);
    }

    const handlePagar = useCallback(async () => {
        setLoading(true);

        //0. Verificar nuevamente si hubo cambio en el estatus del producto o la tienda
        const idsNoDisponiblesActualizados = await verificarDisponibilidad();

        // 1. Filtrar productos no disponibles usando el valor actualizado.
        const itemsDisponibles = elementosCarrito.filter(
            item => !idsNoDisponiblesActualizados.some(
                noDisp => noDisp.id_producto === item.id_producto && String(noDisp.id_comercio) === String(item.id_comercio)
            ) && item.cantidad > 0
        );


        console.log('Productos no disponibles:', idsNoDisponiblesActualizados);

        console.log("Productos disponibles para pagar:", itemsDisponibles);

        if (itemsDisponibles.length === 0) {
            console.log("No hay productos disponibles para pagar.");
            // Aquí podrías mostrar una alerta al usuario.
            return;
        }

        // 2. Agrupar productos por comercio
        const comprasPorComercio = itemsDisponibles.reduce((acc, item) => {
            const idComercio = item.id_comercio;
            if (!acc[idComercio]) {
                acc[idComercio] = [];
            }
            acc[idComercio].push(item);
            return acc;
        }, {});

        // 3. Crear un objeto de compra completa para cada comercio
        const comprasCompletas = Object.values(comprasPorComercio).map(itemsComercio => {
            const totalComercio = itemsComercio.reduce((acc, item) => acc + (item.precio_producto * item.cantidad), 0);

            const dataCompraCompleta = {
                id_usuario: user.id_usuario,
                id_billetera: user.id_billetera,
                monto: totalComercio,
                id_tipo_transaccion: TIPOS_TRANSACCION.COMPRA_COMERCIO,
                listaItems: itemsComercio,
                compraData: {
                    id_socio: user.id_socio,
                    id_comercio: itemsComercio[0].id_comercio,
                    fecha_compra: new Date().toISOString(),
                    nota: nota,
                    precio_total: totalComercio
                },
            };
            return dataCompraCompleta;
        });

        try{
            await Promise.all(comprasCompletas.map(compraData => compraService.crearCompra(compraData)));
            setLoading(false);
            setShowExitosoModal(true);
            limpiarCarrito();
        }catch(error){
            console.error("Error al crear compras:", error);
        }finally{
            await actualizarSaldoBilletera();
            setTimeout(() => {
                setShowExitosoModal(false);
            }, 2000);
        }

        

    }, [elementosCarrito, user, nota, verificarDisponibilidad]);
    
       
    

    return (
        <React.Fragment>
        <LoadingModal visible={loading} />
        <ExitosoModal visible={showExitosoModal} onClose={() => setShowExitosoModal(false)} mensaje={'Compra realizada con éxito!'} />
        <ConfirmarModal visible={showConfirmarModal} onConfirm={handleLimpiarCarrito} onCancel={() => setShowConfirmarModal(false)} mensaje={'¿Está seguro de eliminar todos los elementos del Carrito?'}></ConfirmarModal>
        <div className="vista-carrito-overlay" onClick={handleClose}>
            <div className="vista-carrito" onClick={(e) => e.stopPropagation()}>
                <div className="vista-carrito-header">
                    <i className='fa fa-shopping-cart'></i>
                    <h2 className='vista-carrito-title'>Tu Carrito</h2>
                    <button className="vista-carrito-cerrar" onClick={onClose}>&times;</button>
                </div>
                <ul className='vista-carrito-lista'>
                    {elementosCarrito.length > 0 ?

                    elementosCarrito.map(item => (
                        <li 
                            key={item.id_producto} 
                            className={`vista-carrito-item ${itemsNoDisponibles.some(noDisp => noDisp.id_producto === item.id_producto && String(noDisp.id_comercio) === String(item.id_comercio)) ? 'no_disponible' : ''}`}
                        >
                            <img className='vista-carrito-imagen' src={ hamburguesaPlaceholder} alt={item.nombre_producto} />
                            <span>{item.nombre_producto} - ${item.precio_producto.toFixed(2)}</span>
                            <span className='vista-carrito-comercio'>{item.nombre_comercio}</span>
                            <div className='controles-cantidad'>
                                {/* Botones para actualizar cantidad */}
                                <button onClick={() => updateCantidad(item.id_producto, item.id_comercio, -1)}>-</button>
                                <span> Cantidad: {item.cantidad} </span>
                                <button onClick={() => updateCantidad(item.id_producto, item.id_comercio, 1)}>+</button>
                                <button className='boton-eliminar' onClick={() => removeFromCarrito(item.id_producto, item.id_comercio)}>
                                    <i className='fa fa-trash'></i> 
                                </button>
                            </div>
                            { itemsNoDisponibles.some(noDisp => noDisp.id_producto === item.id_producto && String(noDisp.id_comercio) === String(item.id_comercio)) &&
                                <div className='vista-carrito-item-no-disponible'>
                                    <span>
                                        No Disponible 
                                    </span>
                                    <button className='boton-eliminar' onClick={() => removeFromCarrito(item.id_producto, item.id_comercio)}>
                                        <i className='fa fa-trash'></i> 
                                    </button>
                                </div>
                            }

                            
                        </li>
                    )) : 

                    (
                        <li className='vista-carrito-item vista-carrito-vacio'>
                            <p>No hay productos en el carrito.</p>
                        </li>
                    )
                
                }
                </ul>
                {elementosCarrito.length > 0 && 
                    <div className='vista-carrito-footer'>
                        <textarea 
                            placeholder='Añadir una nota...'
                            className='vista-nota-compra' 
                            value={nota} onChange={(e) => setNota(e.target.value)}>
                        </textarea>
                        <h3 className='vista-carrito-total'>Total: ${total.toFixed(2)}</h3>
                        <div className='vista-carrito-acciones'>

                            <Button 
                                className='primary'
                                onClick={handlePagar}
                                >
                                Proceder al Pago
                            </Button>
                            <Button className='tertiary' onClick={confirmLimpiarCarrito}>
                                Limpiar Carrito
                            </Button>

                        </div>
                    </div>
                }
            </div>
        </div>
        </React.Fragment>
    );
}

export default VistaCarrito;