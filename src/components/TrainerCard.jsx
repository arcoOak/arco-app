// src/components/NewsCard.jsx (o donde prefieras guardar tus componentes)
import React from 'react';
import '../css/TrainerCard.css'; // Asegúrate de crear este archivo CSS para los estilos de la tarjeta

const TrainerCard = ({ sport, name, description, imageUrl, imageAlt, onClick }) => {

    // Se le coloca un limite de 50 caracteres a la descripción
    const descriptionText = description.length > 75 ? description.substring(0, 50) + '...' : description;

    return (
        <div className="trainer-card" onClick={onClick}>
            <div className="trainer-card__image-container">
                <img src={imageUrl} alt={imageAlt} className="trainer-card__image" />
            </div>
            <div className='trainer-content'>
                <div className="trainer-card__title">
                    <h5 className="">{name}</h5>
                </div>
                <p className="trainer-card__category">{sport}</p>
                <p className="trainer-card__description">{descriptionText}</p>
            </div>
        </div>
    );
};

export default TrainerCard;