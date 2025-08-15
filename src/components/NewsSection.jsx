// src/components/NewsSection.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'; // Importa useCallback
import NewsCard from './NewsCard';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

import noticiasService from '../services/noticias.service';

import Button from './buttons/Button';

import placeholder_1 from '../img/news/placeholder_1.jpg';
import placeholder_2 from '../img/news/placeholder_2.jpg';
import placeholder_3 from '../img/news/placeholder_3.jpg';
import placeholder_4 from '../img/news/placeholder_4.jpg';


const NewsSection = () => {
    const { user, isDarkTheme } = useAuth(); // Obtiene el usuario del contexto

    const navigate = useNavigate(); // Hook para navegar programáticamente

    const [ultimasNoticias, setUltimasNoticias] = useState([]);

    useEffect ( () =>{
        const fetchUltimasNoticias = async () => {
            try{
                const noticias = await noticiasService.getUltimasNoticias(user.id_club);
                setUltimasNoticias(noticias);

            }catch (error){
                console.error('Error al obtener las últimas noticias:', error);
                setUltimasNoticias([]);
            }
            
        }

        if(user){
            fetchUltimasNoticias();
        }

    }, [user] )


    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Usa useCallback para memorizar las funciones de los handlers
    // Esto evita que se creen nuevas funciones en cada render si las dependencias no cambian
    const handleMouseDown = useCallback((e) => {
        if (!carouselRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
        carouselRef.current.style.cursor = 'grabbing';
    }, []); // Dependencias vacías porque no dependen de props o estado que cambien y que causen la recreación de la función

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        // Usamos la posición actual del cursor (e.pageX) y la posición inicial (startX)
        // Y el scrollLeft inicial para calcular el desplazamiento
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Multiplicador para la velocidad de arrastre
        carouselRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]); // Dependencias para que la función se actualice cuando estos estados cambien

    const handleMouseUp = useCallback(() => {
        if (!carouselRef.current) return;
        setIsDragging(false);
        carouselRef.current.style.cursor = 'grab';
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (!carouselRef.current) return;
        setIsDragging(false);
        carouselRef.current.style.cursor = 'grab';
    }, []);

    // Handlers para eventos táctiles
    const handleTouchStart = useCallback((e) => {
        if (!carouselRef.current) return;
        setIsDragging(true);
        setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging || !carouselRef.current) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);


    // useEffect para añadir y remover listeners
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        // Eventos de ratón
        carousel.addEventListener('mousedown', handleMouseDown);
        // Estos dos listeners deben ser en el `window` o `document` para que el arrastre no se corte
        // si el cursor sale del elemento mientras se arrastra.
        // Pero para simplificar en React y evitar efectos secundarios globales, a menudo se ponen en el elemento.
        // Si tienes problemas, considera poner mousemove y mouseup en `window` durante el `isDragging`
        carousel.addEventListener('mousemove', handleMouseMove);
        carousel.addEventListener('mouseup', handleMouseUp);
        carousel.addEventListener('mouseleave', handleMouseLeave);


        // Eventos táctiles
        carousel.addEventListener('touchstart', handleTouchStart);
        carousel.addEventListener('touchmove', handleTouchMove);
        carousel.addEventListener('touchend', handleTouchEnd);


        return () => {
            // Limpieza: remover todos los listeners cuando el componente se desmonte
            carousel.removeEventListener('mousedown', handleMouseDown);
            carousel.removeEventListener('mousemove', handleMouseMove);
            carousel.removeEventListener('mouseup', handleMouseUp);
            carousel.removeEventListener('mouseleave', handleMouseLeave);


            carousel.removeEventListener('touchstart', handleTouchStart);
            carousel.removeEventListener('touchmove', handleTouchMove);
            carousel.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, handleTouchStart, handleTouchMove, handleTouchEnd]);
    // Las dependencias de useEffect ahora son las funciones memorizadas con useCallback.
    // Esto asegura que el efecto solo se re-ejecute si las definiciones de estas funciones cambian,
    // lo cual solo ocurre si sus propias dependencias internas cambian.

    let placeholderImage = '';

    const handleNavigate = (id) => {
        navigate(`/Noticias/${id}`, { state: { returnTo: '/' } });
    }

    return (
        <div className="news-section-container">
            <div className="news-section__header">
                <h3 className={`news-section__title`}>Noticias Recientes</h3>

                <Button
                    onClick={() => navigate('/Noticias')}
                    className='primary'
                >
                    Ver Todo
                </Button>

            </div>
            <div className="news-section__carousel" ref={carouselRef}>
                {ultimasNoticias.map(news => (

                placeholderImage = news.id_categoria == 1 ? placeholder_1 : 
                news.id_categoria == 2 ? placeholder_2 : 
                news.id_categoria == 3 ? placeholder_3 : 
                news.id_categoria == 4 ? placeholder_4 : '',

                    <NewsCard
                        key={news.id_noticia}
                        categoria={news.nombre_categoria_noticia}
                        titulo={news.titulo}
                        autor={news.nombre_autor}
                        imageUrl={news.imageUrl || placeholderImage}
                        imageAlt={news.titulo}
                        onClick={() => handleNavigate(news.id_noticia)}
                    />
                ))}
            </div>
        </div>
    );
};

export default NewsSection;