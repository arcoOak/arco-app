import React from 'react';
import TransactionItem from './TransactionItem';
import '../css/HomeComponents.css';

const transactionsData = [
    { id: 1, icon: 'ΨP', title: 'Restaurant Submarine', time: '01:41 PM, Today', amount: '-$14.5', type: 'debit' },
    { id: 2, icon: 'B', title: 'Opera ticket\'s', time: '11:26 AM', amount: '-$270', type: 'debit' },
    { id: 3, icon: 'D', title: 'Cafe cashback', time: '11:26 AM, Today', amount: '+$0.75', type: 'credit' },
    // Add more transactions here
];

const Transactions = () => {
    return (
        <div className="transactions-section">
            <div className="transactions-header">
                <h2 className="transactions-title">Transactions</h2>
                <div className="transactions-controls">
                    {/* Replace with actual icon components */}
                    <button className="icon-button"><i className="fas fa-search"></i></button>
                    <button className="icon-button"><i className="fas fa-sliders-h"></i></button>
                </div>
            </div>
            <div className="transactions-list">
                {transactionsData.map(transaction => (
                    <TransactionItem
                        key={transaction.id}
                        icon={transaction.icon}
                        title={transaction.title}
                        time={transaction.time}
                        amount={transaction.amount}
                        type={transaction.type}
                    />
                ))}
            </div>
        </div>
    );
};

export default Transactions;