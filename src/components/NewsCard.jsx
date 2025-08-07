// src/components/NewsCard.jsx (o donde prefieras guardar tus componentes)
import React from 'react';

import './NewsCard.css'; // Asegúrate de crear este archivo CSS para los estilos de la tarjeta

const NewsCard = ({ categoria, titulo, autor, imageUrl, imageAlt, onClick }) => {
    return (
        <div className="news-card" onClick={onClick}>
            <div className="news-card__image-container">
                <img src={imageUrl} alt={imageAlt} className="news-card__image" />
            </div>
            <p className="news-card__category">{categoria}</p>
            <h3 className="news-card__title">{titulo}</h3>
            <p className="news-card__author">{autor}</p>
        </div>
    );
};

export default NewsCard;