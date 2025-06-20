// src/components/CreditCard.jsx
import React from 'react';
import '../css/CreditCard.css'; // Asegúrate de crear este archivo CSS para los estilos de la tarjeta

const CreditCard = ({ cardNumber, cardHolder, bankName, expiryDate, cardColorClass, iconChip, iconVisa }) => {
    // Función para formatear el número de tarjeta en grupos de 4
    const formatCardNumber = (number) => {
        return number.replace(/(.{4})/g, '$1 ').trim();
    };

    return (
        <div className={`credit-card ${cardColorClass}`}>
            <div className="credit-card__top">
                <img src={iconChip} alt="Chip" className="credit-card__chip" />
                <span className="credit-card__bank-name">{bankName}</span>
            </div>
            <div className="credit-card__number">
                {formatCardNumber(cardNumber)}
            </div>
            <div className="credit-card__bottom">
                <div>
                    <p className="credit-card__holder-label">CARD HOLDER</p>
                    <p className="credit-card__holder-name">{cardHolder}</p>
                </div>
                <div>
                    <p className="credit-card__expiry-label">EXPIRES</p>
                    <p className="credit-card__expiry-date">{expiryDate}</p>
                </div>
                <img src={iconVisa} alt="Visa Logo" className="credit-card__logo" />
            </div>
        </div>
    );
};

export default CreditCard;