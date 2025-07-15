import { useState, useRef, useCallback } from 'react';

/**
 * Un custom hook que proporciona la lógica para arrastrar y desplazar un elemento.
 * @returns {object} - Un objeto que contiene la ref para el contenedor y los manejadores de eventos del mouse.
 */
export const useDragToScroll = () => {
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = useCallback((e) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        e.preventDefault();
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
    }, []);

    const onMouseLeaveOrUp = useCallback(() => {
        if (!scrollContainerRef.current || !isDragging) return;
        setIsDragging(false);
        scrollContainerRef.current.style.cursor = 'grab';
    }, [isDragging]);

    const onMouseMove = useCallback((e) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // El factor 1.5 acelera el scroll
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }, [isDragging, startX, scrollLeft]);

    return {
        scrollContainerRef,
        dragHandlers: { onMouseDown, onMouseLeave: onMouseLeaveOrUp, onMouseUp: onMouseLeaveOrUp, onMouseMove },
    };
};


