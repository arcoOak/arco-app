import React, { useState, useMemo, useRef, useEffect  } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "../css/Balance.css";

import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

export default function Balance() {

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1); 

    const statusColorPayment = '#22ad82';

    const { saldoBilletera } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const navigate = useNavigate();

    const monthsRef = useRef({});

    const listaMeses = useMemo(() => {
            return [
                {
                    nombre: 'Enero',
                    numero: 1
                },
                {
                    nombre: 'Febrero',
                    numero: 2
                },
                {
                    nombre: 'Marzo',
                    numero: 3
                },
                {
                    nombre: 'Abril',
                    numero: 4
                },
                {
                    nombre: 'Mayo',
                    numero: 5
                },
                {
                    nombre: 'Junio',
                    numero: 6
                },
                {
                    nombre: 'Julio',
                    numero: 7
                },
                {
                    nombre: 'Agosto',
                    numero: 8
                },
                {
                    nombre: 'Septiembre',
                    numero: 9
                },
                {
                    nombre: 'Octubre',
                    numero: 10
                },
                {
                    nombre: 'Noviembre',
                    numero: 11
                },
                {
                    nombre: 'Diciembre',
                    numero: 12
                }
            ];
        }, []);

        useEffect(() => {
                const selectedMonthElement = monthsRef.current[mesSeleccionado];
        
                if (selectedMonthElement) {
                    selectedMonthElement.scrollIntoView({
                        behavior: 'smooth', // Para una animación suave
                        inline: 'center',  // Centra el elemento horizontalmente
                        block: 'nearest'   // Evita el scroll vertical innecesario
                    });
                }
            }, [mesSeleccionado]);

    const handleHistoryItemClick = (id) => {
        navigate(`/payment-detail/${id}`);
    };

    return (
        <div className="dashboard-container">
            <section className="calendar-section">
                <div className="calendar-header">
                    <div>
                        <p>Adelanta duplica <i className="fa fa-gift"></i></p>
                    </div>
                    <div>
                        <button>Pagar</button>
                    </div>
                </div>
                <div className="balance-body">
                    <div className="calendar-balance">

                        {
                            listaMeses.map((mes, index) => (
                                <div
                                    key={index}
                                    className={`calendar-item ${mes.numero === 7 ? 'active-month' : ''}`}
                                    onClick={() => handleHistoryItemClick(mes.numero)}
                                    ref={el => monthsRef.current[mes.numero] = el}
                                >
                                    {mes.nombre.slice(0, 3).toUpperCase()} <i className="fa fa-circle" style={{ color: statusColorPayment, fontSize: '11px' }}></i>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className="balance-footer">
                    <div>
                        <p className="recibos-balance">2 Recibos pendientes</p>
                    </div>
                    <div>
                        <p className="total-balance">{saldoBilletera}$</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
