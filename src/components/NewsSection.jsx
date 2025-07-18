// src/components/NewsSection.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'; // Importa useCallback
import NewsCard from './NewsCard';

const NewsSection = () => {
    const newsItems = [
        {
            id: 1,
            category: 'Cuota Especial',
            title: 'Arreglo de tuberias principales del Club',
            imageUrl: './src/img/news/news1.jpg', // Ruta corregida si las imágenes están en public/src/img/news
            imageAlt: 'Arreglo de tuberías',
        },
        {
            id: 2,
            category: 'Cuota Especial',
            title: 'Limpieza de piscina',
            imageUrl: './src/img/news/news2.jpg',
            imageAlt: 'Limpieza de piscina',
        },
        {
            id: 3,
            category: 'Aniversario 35',
            title: 'Celebración del 35 Aniversario del Club', // Título ajustado para el contexto
            imageUrl: './src/img/news/news3.jpg',
            imageAlt: 'Aniversario del Club',
        },
        {
            id: 4,
            category: 'Fiesta Fin de Año',
            title: 'Gran Fiesta de Fin de Año en el Club', // Título ajustado para el contexto
            imageUrl: './src/img/news/news4.jpg',
            imageAlt: 'Fiesta Fin de Año',
        },
        {
            id: 5,
            category: 'Fiesta Fin de Año',
            title: 'Preparativos para la Fiesta de Fin de Año', // Título ajustado para el contexto
            imageUrl: './src/img/news/news4.jpg', // Usando la misma imagen, considera cambiarla
            imageAlt: 'Preparativos Fiesta',
        },
        {
            id: 6,
            category: 'Eventos Deportivos',
            title: 'Torneo de Tenis Interclubes 2025', // Nuevo ítem para mostrar más scroll
            imageUrl: './src/img/news/news5.jpg', // Considera añadir una nueva imagen
            imageAlt: 'Torneo de tenis',
        },
    ];

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

    return (
        <div className="news-section-container">
            <div className="news-section__header">
                <h3 className="news-section__title">Noticias Recientes</h3>
                <button className='button__see-all'>
                    <a href="#" className="news-section__see-all">Ver Todo</a>
                </button>
            </div>
            <div className="news-section__carousel" ref={carouselRef}>
                {newsItems.map(news => (
                    <NewsCard
                        key={news.id}
                        category={news.category}
                        title={news.title}
                        imageUrl={news.imageUrl}
                        imageAlt={news.imageAlt}
                    />
                ))}
            </div>
        </div>
    );
};

export default NewsSection;