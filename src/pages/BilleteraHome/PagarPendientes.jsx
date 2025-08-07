// src/components/PaymentDetail.jsx
import React, { useState, useEffect, useMemo  } from 'react'; // Importa useState
import { useParams, useNavigate } from 'react-router-dom';
import './PagosPendientes.css';

import LoadingModal from '../../components/modals/LoadingModal';

import billeteraService from '../../services/billetera.service'; // Importa el servicio de billetera

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};


const PagarPendientes = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const [pagosPendientes, setPagosPendientes] = useState([]); // 

    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos


    useEffect(() => {

        const obtenerPagosPendientes = async () => {
            try {
                const response = await billeteraService.getPagosPendientes(user.id_socio);
                setPagosPendientes(response);
            } catch (error) {
                console.error('Error al obtener los pagos pendientes:', error);
            }
        };

        if(user) {
            obtenerPagosPendientes();
        }

        setTimeout( () => {
            setLoading(false); // Cambia el estado de carga a false después de 1 segundo
        }, 500)


    },[user] );


    if (!pagosPendientes || pagosPendientes.length === 0 ) {
        return (
            <div className="payment-detail-container">
                <h2>No se encontraron pagos pendientes</h2>
                <button className="back-button" onClick={() => navigate('/')}>Volver al Historial</button>
            </div>
        );
    }

    return (
        <React.Fragment>
            <LoadingModal visible={loading}></LoadingModal>
        <div className="payment-detail-container">
            <button className="back-button" onClick={() => navigate('/')}>&larr; Volver</button>
            <div className="detail-header">
                <h2>Pagos Pendientes</h2>
            </div>

            <div className="payments-container">

            {pagosPendientes.map((payment, idx) => (

                <div className={`detail-card pendiente`} key={idx}>
                    <div className={`payment-header pendiente`}>
                        <p className='payment-title'>{payment.descripcion_contenido}</p>
                    </div>
                    <div className="payment-details">
                        <p className='payment-date'><strong>Fecha: </strong> {formatDate(payment.fecha_generacion)}</p>
                        <p className='payment-amount'><strong>Monto: </strong> ${payment.total_transaccion}</p>

                    <button className="report-payment-button" onClick={ () => {} }>
                        Pagar
                    </button>
                 

                </div>
            </div>)
            )}
            </div>
            {pagosPendientes.length === 0 && (
                <p className="no-payments-message">No hay pagos pendientes.</p>
            )
            }
        </div>
        </React.Fragment>
    );
};

export default PagarPendientes;