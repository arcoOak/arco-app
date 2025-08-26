// src/components/CreditCard.jsx
import React from 'react';
import '../css/CreditCard.css'; // Asegúrate de crear este archivo CSS para los estilos de la tarjeta

import {useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
    }).format(monto);
};

const CreditCard = ({ user, saldo, cardColorClass, iconChip, iconVisa }) => {

    const {saldoBilletera} = useAuth();

    return (
        <div className={`credit-card ${cardColorClass}`}>
            <div className="credit-card__top">
                <p className='credit-card__chip'>Socio {user.nombre_tipo_socio}</p>
            </div>
            <div className="credit-card__number">
                <label>{formatearMonto(saldoBilletera)}</label>
            </div>
            <div className="credit-card__bottom">
                <div>
                    {user.nombre} {user.apellido}
                </div>
                <img src={iconVisa} alt="Visa Logo" className="credit-card__logo" />
            </div>
        </div>
    );
};

export default CreditCard;