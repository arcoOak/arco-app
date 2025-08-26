/*


Cambio de contraseña en perfil de usuario

*/ 

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MisComprasDetalle.css'; 

import { useAuth } from '../../context/AuthContext';

import LoadingModal from '../../components/modals/LoadingModal';

import compraService from '../../services/compra.service';

import BotonVolver from '../../components/buttons/ButtonVolver';



export default function MisComprasDetalle() {
    const navigate = useNavigate();

    const { user } = useAuth(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    //Datos a Cargar

    const [miCompraDetalle, setMiCompraDetalle] = useState(null);

    const [listaProductos, setListaProductos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const response = await compraService.getCompraById(id);

                console.log('Compra obtenida:', response);

                setMiCompraDetalle({
                    id: response.id,
                    fecha_compra: response.fecha_compra,
                    nombre_comercio: response.nombre_comercio,
                    nota: response.nota,
                    estado: response.estado,
                    id_comercio: response.id_comercio,
                    id_compra_comercio: response.id_compra_comercio,
                });

                setListaProductos(response.productos || []); // Asegúrate de que productos sea un array


            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleNavigate = (path, id) =>{
        navigate(`/${path}/${id}`, { state: { returnTo: location.pathname } });
    }

    return (
        <React.Fragment>
        <LoadingModal visible={loading} />

        <BotonVolver to="/compras" />



        <div className="compras-detalle-container">
            <div className="compras-detalle-header">
            <h1>Detalle de la Compra</h1>
            {miCompraDetalle ? (
                <div className="compra-info">
                    <div className='compra-info-header'>
                        <h2>Información de la Compra</h2>
                        <p><strong>Fecha Compra:</strong> {new Date(miCompraDetalle.fecha_compra).toLocaleDateString()}</p>

                        <div className='info-card-link' onClick={() => handleNavigate('comercios', miCompraDetalle.id_comercio)}>
                            <div className='info-card-link__text'>
                                <span className='info-card-link__label'>Comercio</span>
                                <span className='info-card-link__value'>{miCompraDetalle.nombre_comercio}</span>
                            </div>
                            <i className='bx bx-chevron-right info-card-link__icon'></i>
                        </div>

                        <div className='productos-comprados'>
                        <h2>Productos Comprados</h2>
                            {listaProductos.length > 0 ? (
                                <ul className='productos-list'>
                                    {listaProductos.map((producto, index) => (
                                        <li key={index}>
                                            <span className='producto-nombre'>{producto.nombre_producto}</span>
                                            <span className='producto-cantidad'> x {producto.cantidad}</span>
                                            <span className='producto-precio'> ${producto.precio_producto.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay productos comprados para esta compra.</p>
                            )}
                        </div>

                        {miCompraDetalle.nota &&
                            <p><strong>Información Adicional:</strong> <br/> {miCompraDetalle.nota}</p>
                        }
                    </div>

                </div>
            
                
            ) : (
                <p className='loading-text'>Cargando detalles de la compra...</p>
            )}
            </div>

        </div>
        
        
        </React.Fragment>
    );
}