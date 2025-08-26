import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MisCompras.css'; // Asegúrate de importar tu CSS principal

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación}

import LoadingModal from '../../components/modals/LoadingModal';

import comprasService from '../../services/compra.service'; // Asegúrate de tener un servicio para manejar las compras

import MesSelector from '../../components/MesSelector'; // Importa el componente MesSelector

export default function MisCompras() {
    const navigate = useNavigate();

    const { user } = useAuth(); // Obtén el usuario autenticado del contexto

    const [loading, setLoading] = useState(false);

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1); // Estado para el mes seleccionado

    //Datos a Cargar

    const [listaMisServicios, setListaMisServicios] = useState([]);

    const [listaMisCompras, setListaMisCompras] = useState([]); // Estado para las compras

    // Drag to scroll hook

  
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const mesActual = new Date().getMonth() + 1; // Obtener el mes actual (1-12)
                const anhoActual = new Date().getFullYear(); // Obtener el año actual
                const misCompras = await comprasService.getComprasByUsuarioMes(
                    user.id_socio, 
                    mesActual,
                    anhoActual
                )
                console.log('Compras obtenidas:', misCompras);
                setListaMisCompras(misCompras);

            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);



    

    const handleMesSeleccionado = (mes) => {
        setMesSeleccionado(mes);

        const fetchCompras = async () => {
            setLoading(true);
            const anhoActual = new Date().getFullYear(); // Obtener el año actual
            try {
                const misCompras = await comprasService.getComprasByUsuarioMes(
                    user.id_socio,
                    mes, 
                    anhoActual
                );
                console.log('Compras obtenidas para el mes seleccionado:', misCompras);
                setListaMisCompras(misCompras);
            } catch (error) {
                console.error('Error al cargar las compras del mes seleccionado:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompras();

    }


    return (
        <React.Fragment>
        <LoadingModal visible={loading} />
        <div className="compras-container">
            <h2 className='mis-compras-title' >Mis Compras</h2>

            <MesSelector
                mesSeleccionado={mesSeleccionado}
                handleMesSeleccionado={(mes) => handleMesSeleccionado(mes)}
            />


            <div className="compras-list" >
                <div className="compras-list-inner">

                    {listaMisCompras.length > 0 ? (
                        listaMisCompras.map((compra) => (
                            <div 
                                key={compra.id_compra_comercio}
                                onClick={() => navigate(`/compras/${compra.id_compra_comercio}`)} className="compra-item">
                                    <div className="compra-item-header">
                                        <h3 className="compra-item-title">{compra.nombre_comercio}</h3>
                                        
                                        <p className="compra-item-date">Fecha: {new Date(compra.fecha_compra).toLocaleDateString()}</p>
                                    </div>
                                    <div className="compra-item-details">
                                        <span className="compra-item-cantidad">{compra.cantidad_productos} {compra.cantidad_productos > 1 ? 'productos' : 'producto'}</span>
                                        <span className="compra-item-price">{compra.precio_total}$</span>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-compras">
                            <p>No tienes compras para esta fecha.</p>
                        </div>
                    )}

                </div>
            </div>
        </div >
        </React.Fragment>
    );
}