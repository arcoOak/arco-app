import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './NoticiasDetalle.css'; 

import { useAuth } from '../../context/AuthContext';

import LoadingModal from '../../components/modals/LoadingModal';

import noticiasService from '../../services/noticias.service';

import placeholder_1 from '../../img/news/placeholder_1.jpg';
import placeholder_2 from '../../img/news/placeholder_2.jpg';
import placeholder_3 from '../../img/news/placeholder_3.jpg';
import placeholder_4 from '../../img/news/placeholder_4.jpg';

import ButtonVolver from '../../components/buttons/ButtonVolver';

const NoticiasDetalle = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const backLocation = location.state?.returnTo || '/noticias';

    const { user } = useAuth(); 
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    //Datos a Cargar

    const [noticiaDetalle, setNoticiaDetalle] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const noticia = await noticiasService.getNoticiaPorId(user.id_club , id);
                console.log(noticia);
                setNoticiaDetalle(noticia);

            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    

    const imagenNoticia = useMemo( () => {
        if (!noticiaDetalle) return ''; // Retorna un placeholder si no hay noticia
        if (noticiaDetalle && noticiaDetalle.imagen) return noticiaDetalle.imagen;
        switch (noticiaDetalle.id_categoria) {
            case 1:
                return placeholder_1;
            case 2:
                return placeholder_2;
            case 3:
                return placeholder_3;
            case 4:
                return placeholder_4;
        }
    })


    return (
        <React.Fragment>
        <LoadingModal visible={loading} />

        <ButtonVolver to={backLocation} className="boton-volver" />
        <div className="noticias-detalle-container">
            <div className="noticias-detalle-header">
            
            {noticiaDetalle ? (
                
                <div className="noticia-info">
                    <div className='noticia-info-header'>
                        <img 
                            className="noticia-item-image" 
                            src={imagenNoticia} 
                            alt={noticiaDetalle.titulo}

                        />
                        <h1>{noticiaDetalle.titulo}</h1>
                        <p className='noticia-info-date'><strong>Fecha:</strong> {new Date(noticiaDetalle.fecha_publicacion).toLocaleDateString()}</p>
                    </div>
                    

                    <div className='noticia-info-content'>
                        <p>{noticiaDetalle.contenido}</p>
                    </div>

                    <div className='noticia-info-details'>
                        
                        <p><strong>Autor:</strong> {noticiaDetalle.nombre_autor}</p>
                        <p><strong>Categoría:</strong> {noticiaDetalle.nombre_categoria_noticia}</p>
                    </div>

                </div>
            
            ) : (
                <p className='loading-text'>Cargando noticia...</p>
            )}
            </div>
            
        </div>
        
        
        </React.Fragment>
    );
}

export default NoticiasDetalle;