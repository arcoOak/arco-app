import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';

import LoadingModal from '../../components/modals/LoadingModal';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import { useDragToScroll } from '../../hooks/useDragToScroll';

import placeholder_1 from '../../img/news/placeholder_1.jpg';
import placeholder_2 from '../../img/news/placeholder_2.jpg';
import placeholder_3 from '../../img/news/placeholder_3.jpg';
import placeholder_4 from '../../img/news/placeholder_4.jpg';

import './Notifications_user.css';
import MesSelector from '../../components/MesSelector';

const Notificaciones = ()=> {
    const [notificaciones, setNotificaciones] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const navigate = useNavigate();

    const [notificacionesFiltradas, setNotificacionesFiltradas] = useState([]);

    const [loading, setLoading] = useState(true);

    const {user} = useAuth();

    const { scrollContainerRef, dragHandlers } = useDragToScroll();
    const monthsRef = useRef({});

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
    const [anhoSeleccionado, setAnhoSeleccionado] = useState(new Date().getFullYear());

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    useEffect (() =>{

        const fetchNotificaciones = async ()=>{
            try {

                

                setNotificaciones(notificacionesRespuesta);
                setCategorias(categoriasRespuesta);

                setNotificacionesFiltradas(notificacionesRespuesta);
            } catch (error) {
                console.error("Error fetching notificaciones:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000); // Simulate a delay for loading state
            }
        }

        fetchNotificaciones();
    }, [user])

        const handleMesSeleccionado = (mes) => {
            setMesSeleccionado(mes);
        
            const fetchNotificacionesFecha = async () => {
                

            }
            fetchNotificacionesFecha();
        }

        const handleCategoriaSeleccionada = async (categoria) => {

            if (categoriaSeleccionada == categoria) {
                console.log("Categoria ya seleccionada:", categoriaSeleccionada);
                setCategoriaSeleccionada(null);
                setNotificacionesFiltradas(notificaciones); // Reset to all notificaciones if the same category is clicked
                return;
            }
            else{
                console.log("Nueva categoria seleccionada:", categoria);
                setCategoriaSeleccionada(categoria);
                setNotificacionesFiltradas(
                    () => notificacionesFiltradas.filter(notificaciones => notificaciones.id_categoria === categoria)
                );
            }
            
        }


    let placeholderImage = '';

    return (
        <React.Fragment>
            <LoadingModal visible={loading} />

            <div className="notificaciones-container">
            <h2 className='notificaciones-title' >Notificaciones</h2>

            <MesSelector mesSeleccionado={mesSeleccionado} handleMesSeleccionado={(mes) => handleMesSeleccionado(mes)} />

            <div className="notificaciones-categorias">
                <h3 className="notificaciones-categorias-title">Categorías</h3>
                <div className="notificaciones-categorias-list" ref={scrollContainerRef} {...dragHandlers}>
                    {categorias.map((categoria) => (
                        <div 
                            key={categoria.id_categoria} 
                            className={`notificaciones-categoria-item ${categoriaSeleccionada === categoria.id_categoria ? 'active' : ''}`}
                            onClick={ () => handleCategoriaSeleccionada(categoria.id_categoria) }
                        >
                            {categoria.nombre_categoria_notificaciones}
                        </div>
                    ))}
                </div>
            </div>

            <div className="notificaciones-list" >
                <div className="notificaciones-list-inner">
                    
                    {notificacionesFiltradas && notificacionesFiltradas.length > 0 ? (
                        notificacionesFiltradas.map((notificaciones) => (

                            placeholderImage = notificaciones.id_categoria == 1 ? placeholder_1 : 
                                               notificaciones.id_categoria == 2 ? placeholder_2 : 
                                               notificaciones.id_categoria == 3 ? placeholder_3 : 
                                               notificaciones.id_categoria == 4 ? placeholder_4 : '',

                            <div onClick={() => navigate(`/notificaciones/${notificaciones.id_notificaciones}`)} className="notificaciones-item" key={notificaciones.id_notificaciones}>
                                <div className="notificaciones-item-header">
                                    <h3 className="notificaciones-item-title">{notificaciones.titulo}</h3>
                                    
                                </div>
                                <div className="notificaciones-item-details">
                                    
                                    <span className="notificaciones-item-resumen">{notificaciones.resumen}</span>
                                    <p className="notificaciones-item-author">{notificaciones.nombre_autor}</p>
                                    <img 
                                        className="notificaciones-item-image" 
                                        src={notificaciones.imagen ? notificaciones.imagen : placeholderImage} 
                                        alt={notificaciones.titulo}

                                        />
                                    <p className="notificaciones-item-category">{notificaciones.nombre_categoria_notificaciones}</p>
                                    <p className="notificaciones-item-date">{new Date(notificaciones.fecha_publicacion).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-notificaciones-container">
                            <p className="no-notificaciones-message">No hay notificaciones disponibles.</p>
                        </div>
                    )}

                </div>
            </div>
        </div >


        </React.Fragment>
    )

}

export default Notificaciones