import React from 'react';
import '../css/HomeComponents.css';

const TransactionItem = ({ icon, title, time, amount, type }) => {
    const amountClass = type === 'credit' ? 'amount-credit' : 'amount-debit';

    return (
        <div className="transaction-item">
            <div className="transaction-icon-wrapper">
                {/* In a real app, this would be an actual icon component or image */}
                <span className="transaction-icon">{icon}</span>
            </div>
            <div className="transaction-details">
                <div className="transaction-title">{title}</div>
                <div className="transaction-time">{time}</div>
            </div>
            <div className={`transaction-amount ${amountClass}`}>
                {amount}
            </div>
        </div>
    );
};

export default TransactionItem;