import React, { createContext, useState, useEffect ,useContext, useMemo } from 'react';



export const CartContext = createContext(null); // Contexto

export const CartProvider = ({ children }) => {
    const [elementosCarrito, setElementosCarrito] = useState([]); // Almacena los productos en el carrito
    const [loading, setLoading] = useState(true); // Para saber si estamos cargando los datos iniciales
    

    // Cargar los datos del carrito desde localStorage al iniciar la aplicación
    useEffect(() => {
        try{
        const carritoAlmacenado = localStorage.getItem('carrito');
        if(carritoAlmacenado){
            setElementosCarrito(JSON.parse(carritoAlmacenado));
        }
        } catch (error) {
            console.error('Error al cargar el carrito desde localStorage:', error);
            setElementosCarrito([]);
        } finally{
            setLoading(false);
        }
    }, []);

    //Guardar los datos del carrito en localStorage cada vez que cambie
    useEffect(() => {
        if(!loading){
            //console.log('Carrito actualizado:', elementosCarrito);
            localStorage.setItem('carrito', JSON.stringify(elementosCarrito));
        }
    }, [elementosCarrito, loading]);


    // Funciones para agregar y eliminar productos del carrito
    const addToCarrito = (producto, id_comercio) => {
        setElementosCarrito((prevCarrito) => {
            // Buscar si el producto de la misma tienda ya existe en el carrito
            const elementoExistente = prevCarrito.find(
                (ele) => ele.id_producto === producto.id_producto && ele.id_comercio === id_comercio
            );

            // Si el producto ya existe, solo incrementamos la cantidad
            if (elementoExistente) {
                return prevCarrito.map((ele) =>
                    ele.id_producto === producto.id_producto && ele.id_comercio === id_comercio
                        ? { ...ele, cantidad: ele.cantidad + 1 }
                        : ele
                );
            }
            
            // Si no existe, lo agregamos al carrito con cantidad 1
            return [...prevCarrito, { ...producto, id_comercio, cantidad: 1 }];
        });
    };
    
    const removeFromCarrito = (productId, id_comercio) => {
        setElementosCarrito((prevCarrito) =>
            prevCarrito.filter(
                (ele) => !(ele.id_producto === productId && ele.id_comercio === id_comercio)
            )
        );
    };

    const updateCantidad = (productId, id_comercio, valorCambio) => {
        setElementosCarrito((prevCarrito) =>
            prevCarrito
                .map((ele) => {
                    if (ele.id_producto === productId && ele.id_comercio === id_comercio) {
                        const nuevaCantidad = ele.cantidad + valorCambio;
                        return nuevaCantidad > 0 ? { ...ele, cantidad: nuevaCantidad } : null;
                    }
                    return ele;
                })
                .filter(Boolean) // Elimina los elementos nulos (productos con cantidad <= 0)
        );
    };

    const limpiarCarrito = ()=>{
        setElementosCarrito([]); // Limpiar el carrito
        localStorage.removeItem('carrito'); // Eliminar el carrito del localStorage
    }

    const isProductoEnCarrito = (productId, id_comercio) => {
        return elementosCarrito.some(ele => ele.id_producto === productId && ele.id_comercio === id_comercio);
    };

    const totalItems = useMemo(() => {
        return elementosCarrito.reduce((total, item) => total + item.cantidad, 0);
    }, [elementosCarrito]);
    
    return (
        <CartContext.Provider value={{ elementosCarrito, addToCarrito, removeFromCarrito, updateCantidad, limpiarCarrito, isProductoEnCarrito, totalItems,  loading }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCarrito = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCarrito ha de ser utilizado en el contexto de CartProvider');
    }
    return context;
};
