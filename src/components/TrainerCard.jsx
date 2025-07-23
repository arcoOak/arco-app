// src/components/NewsCard.jsx (o donde prefieras guardar tus componentes)
import React from 'react';
import '../css/TrainerCard.css'; // Asegúrate de crear este archivo CSS para los estilos de la tarjeta

const TrainerCard = ({ sport, name, calification, price, imageUrl, imageAlt }) => {
    return (
        <div className="trainer-card">
            <div className="trainer-card__image-container">
                <img src={imageUrl} alt={imageAlt} className="trainer-card__image" />
            </div>
            <div className='trainer-content'>
                <div className="trainer-card__title">
                    <h5 className="">{name}</h5>
                    <label><i className="fa fa-heart"></i></label>
                </div>
                <p className="trainer-card__category">{sport}</p>
                <div className="trainer-price">
                    <p className="trainer-card__category">{calification} <i className="fa fa-star"></i></p>
                    <p className="trainer-card__category">{price}$/hr</p>
                </div>
            </div>
        </div>
    );
};

export default TrainerCard;