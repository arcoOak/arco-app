// src/components/MonthlyOverview.jsx
import React, { useState } from 'react';
import HistoryItem from './HistoryItem';
import '../css/MonthlyOverview.css'; // Importa el archivo CSS para esta sección

const MonthlyOverview = () => {
    // Datos de ejemplo
    const totalPending = 55; // Sumatoria pendiente por cancelar
    const currentMonthDue = 55; // Monto pendiente del mes actual

    const paymentHistory = [
        { id: 1, category: 'Mayo', time: '', amount: 55, statPay: 'debth' },
        { id: 2, category: 'Abril', time: '05/04/2025', amount: 50, statPay: 'paid' },
        { id: 3, category: 'Marzo', time: '05/03/2025', amount: 45, statPay: 'paid' },
        { id: 4, category: 'Febrero', time: '05/02/2025', amount: 43, statPay: 'paid' },
        { id: 5, category: 'Enero', time: '05/01/2025', amount: 40, statPay: 'paid' },
    ];

    const [activeTab, setActiveTab] = useState('History');

    return (
        <div className="monthly-overview-container">
            {/* Sección Superior Oscura */}
            <div className="overview-header">
                <h3 className="overview-header__title">Saldo Actual</h3>
                <span className="overview-header__total-pending">${totalPending.toLocaleString()}</span>
            </div>

            {/* Recuadro Blanco del Monto del Mes Actual */}
            <div className="current-month-card">
                <p className="current-month-card__label">Junio</p>
                <p className="current-month-card__amount">${currentMonthDue.toFixed(2)}</p>
            </div>

            {/* Pestañas de Historial/Estadísticas */}
            <div className="tabs-navigation">
                <button
                    className={`tab-button ${activeTab === 'History' ? 'tab-button--active' : ''}`}
                    onClick={() => setActiveTab('History')}
                >
                    Historial
                </button>
            </div>

            {/* Contenido del Historial (o Estadísticas) */}
            <div className="history-list-section">
                {activeTab === 'History' && (
                    <div className="history-list">
                        {paymentHistory.map(item => (
                            <HistoryItem
                                key={item.id}
                                category={item.category}
                                time={item.time}
                                amount={item.amount}
                                iconType={item.iconType}
                                statPay={item.statPay}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Botón "Ver más detalle" */}
            <button className="view-details-button">Ver más detalle</button>
        </div>
    );
};

export default MonthlyOverview;