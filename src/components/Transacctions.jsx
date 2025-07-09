// src/components/HistoryItem.jsx
import React from 'react';
import logo from '../assets/creditCard.svg'

const Transacctions = ({ account, amount, date, concept }) => {


    return (
        <div className="history-item">
            <div className="history-item__icon-wrapper">
                {/* <IconComponent className="history-it em__icon" /> */}
                <i className="fa fa-credit-card"></i>
            </div>
            <div className="history-item__details">
                <p className="transacction-item__category">{concept}</p>
                <p className="history-item__time">{date}</p>
            </div>
            <div className='history-item__info'>
                <p className="history-item__amount">
                    {amount < 0 ? `- $${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`}
                </p>
                <label>**** 4561</label>
            </div>
        </div>
    );
};

export default Transacctions;