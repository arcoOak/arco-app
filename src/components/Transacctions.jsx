// src/components/HistoryItem.jsx
import React from 'react';
import { CreditCard, CircleDollarSign, Bitcoin } from 'lucide-react'; // Ejemplos de iconos

const Transacctions = ({ account, amount, date, concept }) => {

    let IconComponent;

    switch (account) {
        case 'binance':
            IconComponent = Bitcoin;
            break;
        case 'credito':
            IconComponent = CreditCard;
            break;
        case 'zelle':
            IconComponent = CircleDollarSign;
            break;
        case 'paypal':
            IconComponent = CircleDollarSign;
            break;
        default:
            IconComponent = CircleDollarSign; // Default icon if none matches
    }

    return (
        <div className="history-item">
            <div className="history-item__icon-wrapper">
                <IconComponent className="history-item__icon" />
            </div>
            <div className="history-item__details">
                <p className="transacction-item__category">{concept}</p>
                <p className="history-item__time">{date}</p>
            </div>
            <div className='history-item__info'>
                <p className="history-item__amount">
                    + {amount < 0 ? `- $${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`}
                </p>
                <p className="history-item__status">
                    {account}
                </p>
                {/* <label>5 Entradas por adelantar</label> */}
            </div>
        </div>
    );
};

export default Transacctions;