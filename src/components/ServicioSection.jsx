// src/components/NewsSection.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react'; // Importa useCallback
import TrainerCard from './TrainerCard';

import { useNavigate } from "react-router-dom";

import {useAuth} from '../context/AuthContext';

import serviciosService from '../services/servicios.service';

import servicioImagePlaceholder from '../assets/comercio_placeholder.webp';
import Button from './buttons/Button';


const TrainerSection = () => {

    const [servicios, setServicios] = useState([]);
    const {user, isDarkTheme} = useAuth(); // Obtiene el usuario del contexto de autenticación

    const navigate = useNavigate(); // Hook para navegar programáticamente


    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await serviciosService.getHomeServicios(user.id_club);
                setServicios(response || []);
            } catch (error) {
                console.error("Error fetching servicios:", error);
            }
        };

        fetchServicios();
    }, []);

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

    const handleNavigate = (path, id) => {
        navigate(`/${path}/${id}`, { state: { returnTo: location.pathname } });
    };


    return (
        <div className="trainer-section-container">
            <div className="trainer-section__header">
                <h3 className={`trainer-section__title`}>Servicios Disponibles</h3>

                <Button
                    onClick={() => navigate('/servicios')}
                    className='primary'
                >
                    Ver Todo
                </Button>

            </div>
            <div className="trainer-section__carousel" ref={carouselRef}>
                {servicios.map(data => (
                    <TrainerCard
                        key={data.id_servicio_reservable}
                        sport={data.nombre_categoria_servicio}
                        name={data.nombre_servicio_reservable}
                        description={data.descripcion}
                        imageUrl={data.imageUrl || servicioImagePlaceholder} // Usa la imagen del servicio o una imagen por defecto
                        imageAlt={data.nombre_categoria_servicio}
                        onClick={() => handleNavigate('servicios', data.id_servicio_reservable)} // Navega al detalle del servicio

                    />
                ))}
            </div>
        </div >
    );
};

export default TrainerSection;