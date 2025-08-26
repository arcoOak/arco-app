// src/components/ImageSlider.jsx
import React, { useState } from 'react';
import CreditCard from '../CreditCard'; // Importa el nuevo componente CreditCard
import './TarjetaSaldo.css'; // Asegúrate de mantener este archivo CSS para el contenedor y las propiedades 3D

import { useAuth } from '../../context/AuthContext';

const ImageSlider = () => {

    const { user, saldoBilletera } = useAuth(); // Obtén el saldo de la billetera del contexto de autenticación

    // Datos para las tarjetas de crédito
    const cardData = [
        {
            id: 'card_1',
            color: 'credit-card--blue',
            iconChip: '../src/img/cards/chip.png', // URL de placeholder para el chip
            iconVisa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png', // URL para el logo de Visa
        },
        {
            id: 'card_2',
            color: 'credit-card--brown',
            iconChip: '../src/img/cards/chip.png', // URL de placeholder para el chip
            iconVisa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png',
        },
    ];

    const [slides, setSlides] = useState(
        cardData.map((card, index) => ({
            ...card, // Incluir todos los datos de la tarjeta
            // Propiedades de estilo iniciales (basadas en el orden de apilamiento)
            transform: `translate3d(-50%, -${50 + index * 5}%, -${index * 15}px)`,
            zIndex: cardData.length - index,
            opacity: index === 3 ? 0 : 1 - index * 0.2, // opacity: 0 para la última tarjeta
            isAnimating: false,
        }))
    );

    const [clickable, setClickable] = useState(true);
    const animationSpeed = 500; // ms

    const handleSlideClick = (clickedSlideId) => {
        if (!clickable) return;
        if (clickedSlideId !== slides[0].id) {
            return; // Solo permite clic en la tarjeta más al frente
        }

        setClickable(false);

        setSlides(prevSlides => {
            const newSlides = [...prevSlides];
            const animatingSlide = { ...newSlides[0], isAnimating: true }; // Marcar para animar la salida

            const updatedSlides = [...newSlides.slice(1), animatingSlide];

            return updatedSlides.map((slide, index) => {
                let newTransform;
                let newZIndex;
                let newOpacity;

                // Determinar nuevas propiedades de estilo basadas en el nuevo índice
                if (index === 0) { // Nueva tarjeta al frente
                    newTransform = 'translate3d(-50%, -50%, 0)';
                    newZIndex = 4;
                    newOpacity = 1;
                } else if (index === 1) {
                    newTransform = 'translate3d(-50%, -55%, -15px)';
                    newZIndex = 3;
                    newOpacity = 0.8;
                } else if (index === 2) {
                    newTransform = 'translate3d(-50%, -60%, -30px)';
                    newZIndex = 2;
                    newOpacity = 0.6;
                } else { // La tarjeta que se fue al final
                    newTransform = 'translate3d(-50%, -65%, -45px)';
                    newZIndex = 1;
                    newOpacity = 0;
                }

                return {
                    ...slide,
                    transform: newTransform,
                    zIndex: newZIndex,
                    opacity: newOpacity,
                };
            });
        });

        setTimeout(() => {
            setClickable(true);
            setSlides(prevSlides => prevSlides.map(slide => ({ ...slide, isAnimating: false })));
        }, animationSpeed);
    };

    return (


        <div className="container">
            {slides.map(slide => (
                <div
                    key={slide.id}
                    id={slide.id}
                    className={`slide`}
                    style={{
                        transform: slide.transform,
                        zIndex: slide.zIndex,
                        opacity: slide.opacity,
                        animation: slide.isAnimating ? `move ${animationSpeed}ms forwards` : 'none',
                    }}
                    onClick={() => handleSlideClick(slide.id)}
                >
                    {/* Aquí renderizamos el componente CreditCard en lugar de la imagen de fondo */}
                    <CreditCard
                        user={user}
                        saldo={saldoBilletera}
                        cardColorClass={slide.color}
                        iconChip={slide.iconChip}
                        iconVisa={slide.iconVisa}
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageSlider;