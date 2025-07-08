import React from 'react';


const Card = ({ balance, currency, cardNumber, type = 'blue' }) => {
    return (
        <div className={`card ${type}-card`}>
            <div className="card-header">
                <span className="card-balance-label">Card balance</span>
                <div className="card-icons">
                    {/* Replace with actual icon components */}
                    <i className="fas fa-wifi"></i> {/* Example: Wifi icon */}
                    <i className="fas fa-ellipsis-h"></i> {/* Example: Ellipsis icon */}
                    <div className="card-indicator"></div> {/* Small red/orange dot */}
                </div>
            </div>
            <div className="card-balance">
                <span className="currency">{currency}</span>
                <span className="amount">{balance}</span>
            </div>
            <div className="card-number">{cardNumber}</div>
        </div>
    );
};

export default Card;