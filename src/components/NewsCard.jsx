// src/components/NewsCard.jsx (o donde prefieras guardar tus componentes)
import React from 'react';
import '../css/Home.css'; // Asegúrate de crear este archivo CSS para los estilos de la tarjeta

const NewsCard = ({ category, title, imageUrl, imageAlt }) => {
    return (
        <div className="news-card">
            <div className="news-card__image-container">
                <img src={imageUrl} alt={imageAlt} className="news-card__image" />
            </div>
            <p className="news-card__category">{category}</p>
            <h3 className="news-card__title">{title}</h3>
        </div>
    );
};

export default NewsCard;