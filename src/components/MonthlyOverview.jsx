// src/components/MonthlyOverview.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import HistoryItem from './HistoryItem';
import Transacctions from './Transacctions';
import '../css/MonthlyOverview.css';

const MonthlyOverview = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Datos de ejemplo
    const totalPending = 55; // Sumatoria pendiente por cancelar
    const currentMonthDue = 55; // Monto pendiente del mes actual

    // NOTE: Added a 'date' field to paymentHistory for better detail in PaymentDetail
    // and a `refId` to distinguish payment history for the detail page.
    const paymentHistory = [
        { id: 1, category: 'Mayo', time: '', amount: 55, statPay: 'debth', date: '05/05/2025' },
        { id: 2, category: 'Abril', time: '05/04/2025', amount: 50, statPay: 'paid', date: '05/04/2025' },
        { id: 3, category: 'Marzo', time: '05/03/2025', amount: 45, statPay: 'paid', date: '05/03/2025' },
        { id: 4, category: 'Febrero', time: '05/02/2025', amount: 43, statPay: 'paid', date: '05/02/2025' },
        { id: 5, category: 'Enero', time: '05/01/2025', amount: 40, statPay: 'paid', date: '05/01/2025' },
    ];

    const transacctionsHistory = [
        { id: 1, account: 'binance', amount: 50, date: '04/04/2025', concept: 'Mensualidad' },
        { id: 2, account: 'credito', amount: 45, date: '03/03/2025', concept: 'Mensualidad' },
        { id: 3, account: 'zelle', amount: 43, date: '02/02/2025', concept: 'Mensualidad' },
        { id: 4, account: 'paypal', amount: 40, date: '01/01/2025', concept: 'Mensualidad' },
    ];

    const [activeTab, setActiveTab] = useState('History');

    // Function to handle "Ver más detalle" click
    const handleViewDetails = () => {
        // When clicking "Ver más detalle", you might want to show details
        // of a specific payment (e.g., the most recent one, or all of them
        // if the button implies a summary page for all history).
        // For simplicity, let's navigate to the detail of the first item (Mayo) as an example.
        // In a real scenario, you might have a different logic or pass state.
        navigate(`/payment-detail/${paymentHistory[0].id}`);
    };


    // OPTION 2: If you want to click on each `HistoryItem` to see its detail
    const handleHistoryItemClick = (id) => {
        navigate(`/payment-detail/${id}`);
    };


    return (
        <div className="monthly-overview-container">
            {/* Sección Superior Oscura */}
             <div className="overview-header">
                <i className="fa fa-chevron-up"></i>
            </div>

            {/* Recuadro Blanco del Monto del Mes Actual */}
            {/* <div className="current-month-card">
                <p className="current-month-card__label">Junio</p>
                <p className="current-month-card__amount">${currentMonthDue.toFixed(2)}</p>
            </div> */}

            {/* Pestañas de Historial/Estadísticas */}
            <div className="tabs-navigation">
                <div>
                    <button
                        className={`tab-button ${activeTab === 'History' ? 'tab-button--active' : ''}`}
                        onClick={() => setActiveTab('History')}
                    >
                        Resúmen
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'Statistics' ? 'tab-button--active' : ''}`}
                        onClick={() => setActiveTab('Statistics')}
                    >
                        Transacciones
                    </button>
                </div>
                <div>
                    <button className="icon-button"><i className="fa fa-search"></i></button>
                    <button className="icon-button"><i className="fa fa-sliders-h"></i></button>
                </div>
            </div>

            {/* Contenido del Historial (o Estadísticas) */}
            <div className="history-list-section">
                {activeTab === 'History' && (
                    <div className="history-list">
                        {paymentHistory.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleHistoryItemClick(item.id)}
                                className="history-item-clickable"
                            >
                                <HistoryItem
                                    category={item.category}
                                    time={item.time}
                                    amount={item.amount}
                                    iconType={item.iconType}
                                    statPay={item.statPay}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'Statistics' && (
                    <div className="statistics-placeholder">
                        {transacctionsHistory.map(item => (
                            <div
                                key={item.id}
                                onClick={() => handleHistoryItemClick(item.id)}
                                className="history-item-clickable"
                            >
                                <Transacctions
                                    id={item.id}
                                    account={item.account}
                                    amount={item.amount}
                                    date={item.date}
                                    concept={item.concept}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Botón "Ver más detalle" */}
            {/* If this button should show details for the current month or a summary,
                you'd adjust `handleViewDetails` logic.
                Here, I'm making it navigate to the first item's detail as an example.
            */}
            {/* {activeTab === 'History' && (
                <button className="view-details-button" onClick={handleViewDetails}>Ver más detalle</button>
            )} */}
            {/* Placeholder para estadísticas si no hay datos */}
        </div>
    );
};

export default MonthlyOverview;