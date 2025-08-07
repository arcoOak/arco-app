import React, { useState, useEffect, useMemo, useContext, useRef } from 'react';

import noticiasService from '../../services/noticias.service';

import LoadingModal from '../../components/modals/LoadingModal';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import { useDragToScroll } from '../../hooks/useDragToScroll';

import placeholder_1 from '../../img/news/placeholder_1.jpg';
import placeholder_2 from '../../img/news/placeholder_2.jpg';
import placeholder_3 from '../../img/news/placeholder_3.jpg';
import placeholder_4 from '../../img/news/placeholder_4.jpg';

import './Noticias.css';
import MesSelector from '../../components/MesSelector';

const Noticias = ()=> {
    const [noticias, setNoticias] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const navigate = useNavigate();

    const [noticiasFiltradas, setNoticiasFiltradas] = useState([]);

    const [loading, setLoading] = useState(true);

    const {user} = useAuth();

    const { scrollContainerRef, dragHandlers } = useDragToScroll();
    const monthsRef = useRef({});

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
    const [anhoSeleccionado, setAnhoSeleccionado] = useState(new Date().getFullYear());

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

    useEffect (() =>{

        const fetchNoticias = async ()=>{
            try {

                const [noticiasRespuesta , categoriasRespuesta] = await Promise.all([
                    noticiasService.getNoticiasPorMesAnho(user.id_club, mesSeleccionado || 
                        new Date().getMonth() + 1, 
                        new Date().getFullYear()
                    ),
                    noticiasService.getCategoriasNoticias(user.id_club)
                ]);

                setNoticias(noticiasRespuesta);
                setCategorias(categoriasRespuesta);

                setNoticiasFiltradas(noticiasRespuesta);
            } catch (error) {
                console.error("Error fetching noticias:", error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000); // Simulate a delay for loading state
            }
        }

        fetchNoticias();
    }, [user])

   



        const handleMesSeleccionado = (mes) => {
            setMesSeleccionado(mes);
        
            const fetchNoticiasFecha = async () => {
                try {
                    setLoading(true);
                    const noticiasRespuesta = await noticiasService.getNoticiasPorMesAnho(user.id_club, mes, anhoSeleccionado);
                    setNoticias(noticiasRespuesta);

                    setNoticiasFiltradas(noticiasRespuesta);
                    setCategoriaSeleccionada(null); // Reset category selection when changing month

                    

                } catch (error) {
                    console.error("Error fetching noticias por fecha:", error);

                    setNoticiasFiltradas([]);
                    setCategoriaSeleccionada(null); // Reset category selection on error
                } finally{
                    setTimeout(() => {
                        setLoading(false);
                    }, 500); 
                }

            }
            fetchNoticiasFecha();
        }

        const handleCategoriaSeleccionada = async (categoria) => {

            if (categoriaSeleccionada == categoria) {
                console.log("Categoria ya seleccionada:", categoriaSeleccionada);
                setCategoriaSeleccionada(null);
                setNoticiasFiltradas(noticias); // Reset to all noticias if the same category is clicked
                return;
            }
            else{
                console.log("Nueva categoria seleccionada:", categoria);
                setCategoriaSeleccionada(categoria);
                setNoticiasFiltradas(
                    () => noticiasFiltradas.filter(noticia => noticia.id_categoria === categoria)
                );
            }
            
        }


    let placeholderImage = '';

    return (
        <React.Fragment>
            <LoadingModal visible={loading} />



            <div className="noticias-container">
            <h2 className='noticias-title' >Noticias</h2>

            <MesSelector mesSeleccionado={mesSeleccionado} handleMesSeleccionado={(mes) => handleMesSeleccionado(mes)} />

            <div className="noticias-categorias">
                <h3 className="noticias-categorias-title">Categorías</h3>
                <div className="noticias-categorias-list" ref={scrollContainerRef} {...dragHandlers}>
                    {categorias.map((categoria) => (
                        <div 
                            key={categoria.id_categoria} 
                            className={`noticias-categoria-item ${categoriaSeleccionada === categoria.id_categoria ? 'active' : ''}`}
                            onClick={ () => handleCategoriaSeleccionada(categoria.id_categoria) }
                        >
                            {categoria.nombre_categoria_noticia}
                        </div>
                    ))}
                </div>
            </div>

            <div className="noticias-list" >
                <div className="noticias-list-inner">
                    
                    {noticiasFiltradas && noticiasFiltradas.length > 0 ? (
                        noticiasFiltradas.map((noticia) => (

                            placeholderImage = noticia.id_categoria == 1 ? placeholder_1 : 
                                                noticia.id_categoria == 2 ? placeholder_2 : 
                                                noticia.id_categoria == 3 ? placeholder_3 : 
                                                noticia.id_categoria == 4 ? placeholder_4 : '',

                            <div onClick={() => navigate(`/noticias/${noticia.id_noticia}`)} className="noticia-item" key={noticia.id_noticia}>
                                <div className="noticia-item-header">
                                    <h3 className="noticia-item-title">{noticia.titulo}</h3>
                                    
                                </div>
                                <div className="noticia-item-details">
                                    
                                    <span className="noticia-item-resumen">{noticia.resumen}</span>
                                    <p className="noticia-item-author">{noticia.nombre_autor}</p>
                                    <img 
                                        className="noticia-item-image" 
                                        src={noticia.imagen ? noticia.imagen : placeholderImage} 
                                        alt={noticia.titulo}

                                        />
                                    <p className="noticia-item-category">{noticia.nombre_categoria_noticia}</p>
                                    <p className="noticia-item-date">{new Date(noticia.fecha_publicacion).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-noticias-container">
                            <p className="no-noticias-message">No hay noticias disponibles.</p>
                        </div>
                    )}

                </div>
            </div>
        </div >


        </React.Fragment>
    )

}

export default Noticias