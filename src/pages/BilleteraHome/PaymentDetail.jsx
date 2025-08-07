// src/components/PaymentDetail.jsx
import React, { useState, useEffect, useMemo, useRef, useContext  } from 'react'; // Importa useState
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './PaymentDetail.css';

import LoadingModal from '../../components/modals/LoadingModal';

import billeteraService from '../../services/billetera.service'; // Importa el servicio de billetera

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import MesSelector from '../../components/MesSelector'; // Importa el componente MesSelector


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};

const formatPlural = (count, singular, plural) => {
    return count == 1 ? singular : plural;
};




const PaymentDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const mesHome = location.state?.mes;

    const { user } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const [registroTransacciones, setRegistroTransacciones] = useState([]); // 

    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

    const [mesSeleccionado, setMesSeleccionado] = useState(mesHome || new Date().getMonth() + 1);


    

    useEffect(() => {
        const obtenerRegistroTransacciones = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const response = await billeteraService.getTransaccionesBilleteraCompletaPorMes(user.id_socio, mesSeleccionado);
                console.log(response);
                setRegistroTransacciones(response);
            } catch (error) {
                console.error('Error al obtener el registro de transacciones:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false); // Cambia el estado de carga a false después de 500ms
                }, 500);
            }
        };

        obtenerRegistroTransacciones();


    },[user] );
   

    const handleHistoryItemClick = (id_billetera_transaccion) => {
        if(id_billetera_transaccion && id_billetera_transaccion !== null) {
            navigate(`/transaccion/${id_billetera_transaccion}`);
        }
    };

    const handleMesSeleccionado = (mes) => {
                setMesSeleccionado(mes);
            
                const fetchTransaccionesFecha = async () => {
                    try {
                        setLoading(true);
                        const transaccionesRespuesta = await billeteraService.getTransaccionesBilleteraCompletaPorMes(user.id_socio, mes);
                        setRegistroTransacciones(transaccionesRespuesta);
    
                        setTimeout(() => {
                            setLoading(false);
                        }, 500); // Simulate a delay for loading state
    
                    } catch (error) {
                        console.error("Error fetching noticias por fecha:", error);
                    }
    
                }
                fetchTransaccionesFecha();
            }

    
    let estadoPagoUnidad = 0;
    let unidadTransaccion = '';
         

    return (
        <React.Fragment>
            <LoadingModal visible={loading}></LoadingModal>
        <div className="payment-detail-container">
            <button className="back-button" onClick={() => navigate('/')}>&larr; Volver</button>
            <div className="detail-header">
                <h2>Transacciones</h2>
            </div>

            <MesSelector mesSeleccionado={mesSeleccionado} handleMesSeleccionado={(mes) => handleMesSeleccionado(mes)} />


            <div className="payments-container">

            {registroTransacciones.map((payment, idx) => (

                estadoPagoUnidad = payment.estado_transaccion,

                unidadTransaccion = payment.id_tipo_transaccion == 1 ? ['Mensualidad', 'Mensualidades'] : 
                                    payment.id_tipo_transaccion == 2 ? ['Hora Reservada', 'Horas Reservadas'] : 
                                    payment.id_tipo_transaccion == 3 ? ['Producto', 'Productos'] : ['Unidad', 'Unidades'],

                <div className={`detail-card ${estadoPagoUnidad ? 'pago' : 'pendiente'}`} key={idx}
                    onClick={() => handleHistoryItemClick(payment.id_billetera_transaccion)}
                >
                    <div className={`payment-header ${estadoPagoUnidad ? 'pago' : 'pendiente'}`}>
                        <p className='payment-title'>{payment.tipo_transaccion}</p>
                    </div>
                    <div className="payment-details">
                        <p className='payment-date'><strong>Fecha: </strong> {formatDate(payment.fecha_generacion)}</p>
                        <p className='payment-amount'><strong>Monto: </strong> ${payment.total_transaccion}</p>

                        {/* La hora y referencia solo se muestran si ya está pagado */}
                        {
                        estadoPagoUnidad == 1 && (
                            <>
                                <p><strong>Fecha de Pago:</strong> {formatDate(payment.fecha_transaccion)}</p>
                                {/* <p><strong>Referencia:</strong> {payment.reference}</p> */}
                            </>
                        )}

                        {
                            payment.descripcion_cantidad && (
                                <p>
                                    <strong>Descripción: </strong> 
                                <br></br>
                                {payment.descripcion_contenido} 
                                <br></br>
                                {
                                    payment.descripcion_cantidad + ' ' +
                                    formatPlural(payment.descripcion_cantidad, 
                                        unidadTransaccion[0], 
                                        unidadTransaccion[1] )
                                    }
                                </p>
                            )
                        }

                
 

                {/* Mostrar el botón "Reportar Pago" solo si el estado es 'pendiente' */}
                {estadoPagoUnidad == 0 && (
                    <button className="report-payment-button" onClick={ () => {} }>
                        Pagar
                        {/* {showReportForm ? 'Cancelar Reporte' : 'Pagar'} */}
                    </button>
                ) }

                </div>
            </div>)
            )}
            </div>
            {/* Si no hay pagos, mostrar un mensaje */}
            {registroTransacciones.length === 0 && (
                <div className="no-payments-container">
                    <p className="no-payments-message">No hay pagos registrados.</p>
                    
                </div>
            )
            }
        </div>
        </React.Fragment>
    );
};

export default PaymentDetail;