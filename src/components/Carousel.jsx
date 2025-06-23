// src/Carousel.js
import React, { useState, useRef } from 'react';

const Carousel = ({ items }) => {
    // Estado para mantener el orden de los elementos del carrusel
    const [carouselItems, setCarouselItems] = useState(items);

    // Ref para acceder al elemento DOM del carrusel si necesitas manipulaciones directas (menos común en React)
    // En este caso, lo manejamos más a nivel de estado, pero se puede usar para animaciones CSS
    const carouselRef = useRef(null);

    const handleNext = () => {
        setCarouselItems(prevItems => {
            // Clona el primer elemento
            const firstItem = prevItems[0];
            // Crea un nuevo array sin el primer elemento, y añade el clon al final
            return [...prevItems.slice(1), firstItem];
        });
    };

    const handlePrev = () => {
        setCarouselItems(prevItems => {
            // Clona el último elemento
            const lastItem = prevItems[prevItems.length - 1];
            // Crea un nuevo array con el clon al principio, y el resto de elementos excepto el último
            return [lastItem, ...prevItems.slice(0, prevItems.length - 1)];
        });
    };

    return (
        <div className="carousel-container">
            <div className="carousel" ref={carouselRef}>
                {carouselItems.map((item, index) => (
                    <div key={item.id || index} className={`carousel__item ${item.img}`}>
                        <div className='card-chip'>
                            <img src="./src/img/cards/chip.png" alt="Chip"/>
                            <img src="./src/img/cards/visa.png" alt="Chip"/>
                        </div>
                        <div className="card-number">
                            <span>1234</span>
                            <span>5678</span>
                            <span>9876</span>
                            <span>5432</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="controls">
                <button className="prev" onClick={handlePrev}><i className='bx bx-caret-left'></i></button>
                <button className="next" onClick={handleNext}><i className='bx bx-caret-right'></i></button>
            </div>
        </div>
    );
};

export default Carousel;