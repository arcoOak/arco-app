import React, { createContext, useState, useEffect ,useContext } from 'react';



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
            localStorage.setItem('carrito', JSON.stringify(elementosCarrito));
        }
    }, [elementosCarrito, loading]);


    // Funciones para agregar y eliminar productos del carrito
    const addToCarrito = (producto) => {
        setElementosCarrito((prevCarrito) => {
            // Verificar si el producto ya existe en el carrito
            const elementoExiste = prevCarrito.find(ele => ele.id_producto === producto.id_producto); 

            // Si el producto ya existe, incrementar la cantidad
            if (elementoExiste){
                //Retorna el carrito actualizado con la cantidad incrementada
                return prevCarrito.map(ele => { 
                    if(ele.id_producto === producto.id_producto) {
                        return {
                            ...ele,
                            cantidad: ele.cantidad + 1 // Incrementar la cantidad si ya existe
                        };
                    }else{
                        return ele; // Devolver el elemento sin cambios si no es el que se está agregando
                    }
                })
            }
            // Si el producto no existe, agregarlo con cantidad 1
            else{
                return [...prevCarrito, { ...producto, cantidad: 1 }]; 
            }
        });
    };
    
    const removeFromCarrito = (productId) => {
        setElementosCarrito((prevCarrito) => {
            const carritoActualizado = prevCarrito.filter(ele => ele.id_producto !== productId);
            return carritoActualizado;
        });
    };

    const updateCantidad = (productId, valorCambio)=>{
        setElementosCarrito((prevCarrito) => {
        
            prevCarrito.map((ele) => {
                if(ele.id_producto === productId) {
                    const nuevaCantidad = ele.cantidad + valorCambio; // Calcular la nueva cantidad
                    if( nuevaCantidad <= 0){
                        // Si la nueva cantidad es menor o igual a 0, eliminar el producto del carrito
                        return null; // Devolver null para eliminar este elemento
                    }
                    return {
                        ...ele,
                        cantidad: nuevaCantidad // Actualizar la cantidad del producto
                    };
                }
                
                return ele; // Devolver el elemento sin cambios si no es el que se está actualizando
                
            }).filter(ele => ele !== null); // Filtrar los elementos nulos (los que se eliminaron)
        })
    }

    const limpiarCarrito = ()=>{
        setElementosCarrito([]); // Limpiar el carrito
        localStorage.removeItem('carrito'); // Eliminar el carrito del localStorage
    }
    
    return (
        <CartContext.Provider value={{ elementosCarrito, addToCarrito, removeFromCarrito, updateCantidad, limpiarCarrito, loading }}>
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
