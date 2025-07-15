import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../css/Balance.css";

export default function Balance() {

    const statusColorPayment = '#22ad82';

    const navigate = useNavigate();
    const handleHistoryItemClick = (id) => {
        navigate(`/payment-detail/${id}`);
    };

    return (
        <div className="dashboard-container">
            <section className="calendar-section">
                <div className="calendar-header">
                    <div>
                        <p>Adelanta y Obtén<br /> Recompensas <i className="fa fa-gift"></i></p>
                    </div>
                    <div>
                        <button>Pagar</button>
                    </div>
                </div>
                <div className="balance-body">
                    <div className="calendar-balance">
                        {/* <div className="calendar-item">ENE <i className="fa fa-circle" style={{color: statusColorPayment, fontSize: '11px'}}></i></div>
                        <div className="calendar-item">FEB <i className="fa fa-circle" style={{color: statusColorPayment, fontSize: '11px'}}></i></div>
                        <div className="calendar-item">MAR <i className="fa fa-circle" style={{color: statusColorPayment, fontSize: '11px'}}></i></div>
                        <div className="calendar-item">ABR <i className="fa fa-circle" style={{color: statusColorPayment, fontSize: '11px'}}></i></div>
                        <div className="calendar-item">MAY <i className="fa fa-circle" style={{color: statusColorPayment, fontSize: '11px'}}></i></div>
                        <div className="calendar-item">JUN <i className="fa fa-circle" style={{color: '#d74545', fontSize: '11px'}}></i></div> */}
                        <div
                            className="calendar-item active-month"
                            onClick={() => handleHistoryItemClick(7)}
                        >
                            JUL <i className="fa fa-circle" style={{ color: '#d74545', fontSize: '11px' }}></i>
                        </div>
                        <div
                            className="calendar-item"
                            onClick={() => handleHistoryItemClick(8)}
                        >
                            AGO <i className="fa fa-circle" style={{ color: '#bbbbbb', fontSize: '11px' }}></i>
                        </div>
                        <div
                            className="calendar-item"
                            onClick={() => handleHistoryItemClick(9)}
                        >
                            SEP <i className="fa fa-circle" style={{ color: '#bbbbbb', fontSize: '11px' }}></i>
                        </div>
                        <div
                            className="calendar-item"
                            onClick={() => handleHistoryItemClick(10)}
                        >
                            OCT <i className="fa fa-circle" style={{ color: '#bbbbbb', fontSize: '11px' }}></i>
                        </div>
                        <div
                            className="calendar-item"
                            onClick={() => handleHistoryItemClick(11)}
                        >
                            NOV <i className="fa fa-circle" style={{ color: '#bbbbbb', fontSize: '11px' }}></i>
                        </div>
                        <div
                            className="calendar-item"
                            onClick={() => handleHistoryItemClick(12)}
                        >
                            DIC <i className="fa fa-circle" style={{ color: '#bbbbbb', fontSize: '11px' }}></i>
                        </div>
                    </div>
                </div>
                <div className="balance-footer">
                    <div>
                        <p className="recibos-balance">2 Recibos pendientes</p>
                    </div>
                    <div>
                        <p className="total-balance">102.06$</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
