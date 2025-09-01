// src/components/PaymentDetail.jsx
import React, { useState, useEffect, useMemo  } from 'react'; // Importa useState
import { useParams, useNavigate } from 'react-router-dom';
import './PagosPendientes.css';

import LoadingModal from '../../components/modals/LoadingModal';
import ExitosoModal from '../../components/modals/ExitosoModal';

import transaccionesService from '../../services/transacciones.service'; // Importa el servicio de transacciones
import billeteraService from '../../services/billetera.service.js';

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import Button from '../../components/buttons/Button';
import ButtonVolver from '../../components/buttons/ButtonVolver';

import {TIPOS_TRANSACCION} from '../../constants/transaccion.constants.js'; 


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};


const PagarPendientes = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, actualizarSaldoBilletera } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const [pagosPendientes, setPagosPendientes] = useState([]); // 

    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

    const [showExitosoModal, setShowExitosoModal] = useState(false);

    const backLocation = location.state?.backLocation || '/';

    useEffect(() => {

        const obtenerPagosPendientes = async () => {
            try {
                const response = await transaccionesService.getTransaccionesPendientes(user.id_socio);
                console.log(response);
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

    const handlePagar = async (transaccion) => {

        const obtenerPagosPendientes = async () => {
            try {
                const response = await transaccionesService.getTransaccionesPendientes(user.id_socio);
                console.log(response);
                setPagosPendientes(response);
            } catch (error) {
                console.error('Error al obtener los pagos pendientes:', error);
            }
        };

        try {
            const transaccionData = {
                id_pago_asociado: transaccion.id_pago_asociado,
                id_billetera: user.id_billetera,
                id_tipo_transaccion: transaccion.id_tipo_transaccion,
                monto: (transaccion.total_transaccion)
            }

            let response;

            if(TIPOS_TRANSACCION.RECARGA == transaccionData.id_tipo_transaccion){
                response = await billeteraService.validarRecarga(transaccionData);
            }else{
                response = await transaccionesService.pagarTransaccion(transaccionData);
            }
            

            if(response) {
                setShowExitosoModal(true);
                actualizarSaldoBilletera();
            }

        } catch (error) {
            console.error('Error al procesar el pago:', error);
        }finally{
            setLoading(false);
            setTimeout(() => {
                setShowExitosoModal(false); // Cerrar modal de éxito después de 2
                
                if(user) {
                    obtenerPagosPendientes();
                }
            }, 2000);

            
        }
    }


    if (!pagosPendientes || pagosPendientes.length === 0 ) {
        return (
            <React.Fragment>
                <ButtonVolver to={backLocation} className="boton-volver" />
                <div className="payment-detail-container">
                    <h2>No se encontraron pagos pendientes</h2>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <LoadingModal visible={loading}></LoadingModal>
            <ButtonVolver to={backLocation} className="boton-volver" />
            <ExitosoModal 
                visible={showExitosoModal} 
                mensaje='¡Pago con éxito!'  
            />
        <div className="payment-detail-container">
            <div className="detail-header">
                <h2>Pagos Pendientes</h2>
            </div>

            <div className="payments-container">

            {pagosPendientes.map((payment, idx) => (

                <div className={`detail-card pendiente`} key={idx}>
                    <div className={`payment-header pendiente`}>
                        <h3 className='payment-title'>{payment.descripcion_contenido}</h3>
                    </div>
                    <div className="payment-details">
                        <p className='payment-date'><strong>Fecha: </strong> {formatDate(payment.fecha_generacion)}</p>
                        <p className='payment-amount'><strong>Monto: </strong> ${payment.total_transaccion}</p>

                    { payment.id_tipo_transaccion !== TIPOS_TRANSACCION.RECARGA &&
                    <Button
                        onClick={() => {handlePagar(payment)}}
                        className='primary'
                    >
                        Pagar
                    </Button>
                    }

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