// src/components/HistoryItem.jsx
import React from 'react';
import { BadgeCheck, Badge, Ticket } from 'lucide-react'; // Ejemplos de iconos

const HistoryItem = ({ category, time, amount, iconType, statPay }) => {
    let IconComponent;
    let color;
    switch (iconType) {
        case 'money':
            IconComponent = BadgeCheck;
            break;
    }

    switch (statPay) {
        case 'debth':
            IconComponent = Badge;
            color = 'red'; // Cambia el color del icono si es necesario
            break;
        case 'paid':
            IconComponent = BadgeCheck;
            color = 'green'; // Cambia el color del icono si es necesario
            break;
        default:
            IconComponent = Badge; // Default icon if none matches
    }

    return (
        <div className="history-item">
            <div className="history-item__icon-wrapper">
                <IconComponent className="history-item__icon" />
            </div>
            <div className="history-item__details">
                <p className="history-item__category">{category}</p>
                <p className="history-item__time">{time}</p>
            </div>
            <div>
                {statPay === 'debth' ? (
                    <p className="history-item__amount">
                        {amount < 0 ? `- $${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`}
                    </p>
                ) : (
                    <p className="history-item__amount" style={{ color: 'green' }}>
                        + {amount < 0 ? `- $${Math.abs(amount).toFixed(2)}` : `$${amount.toFixed(2)}`}
                    </p>
                )}
                {/* <label>5 Entradas por adelantar</label> */}
            </div>
        </div>
    );
};

export default HistoryItem;