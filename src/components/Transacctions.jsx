// src/components/HistoryItem.jsx
import React from 'react';
import logo from '../assets/creditCard.svg'

const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', opciones);
    return fechaFormateada;
};


const Transacctions = ({ descripcion_transaccion, monto, fecha_transaccion, nombre_transaccion, classAmount }) => {


    return (
        <div className="history-item">
            <div className="history-item__icon-wrapper">
                {/* <IconComponent className="history-it em__icon" /> */}
                <i className="fa fa-credit-card"></i>
            </div>
            <div className="history-item__details">
                <p className="transacction-item__category">{nombre_transaccion}</p>
                <p className="history-item__time">{formatearFecha(fecha_transaccion)}</p>
            </div>
            <div className='history-item__info'>
                <p className={`history-item__amount ${classAmount} `}>
                    {monto}
                </p>
                <label>{descripcion_transaccion}</label>
            </div>
        </div>
    );
};

export default Transacctions;