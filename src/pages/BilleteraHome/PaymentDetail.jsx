// src/components/PaymentDetail.jsx
import React, { useState, useEffect, useMemo, useRef, useContext  } from 'react'; // Importa useState
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './PaymentDetail.css';

import LoadingModal from '../../components/modals/LoadingModal';

import transaccionesService from '../../services/transacciones.service.js'; // Importa el servicio de billetera

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import MesSelector from '../../components/MesSelector'; // Importa el componente MesSelector

import ButtonVolver from '../../components/buttons/ButtonVolver'; // Importa el componente ButtonVolver

import Button from '../../components/buttons/Button';

import ExitosoModal from '../../components/modals/ExitosoModal';

import {TIPOS_TRANSACCION} from '../../constants/transaccion.constants.js'; 

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
    const backLocation = location.state?.backLocation || '/';

    const { user, actualizarSaldoBilletera } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const [registroTransacciones, setRegistroTransacciones] = useState([]); // 

    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

    const [mesSeleccionado, setMesSeleccionado] = useState(mesHome || new Date().getMonth() + 1);

    const [showExitosoModal, setShowExitosoModal] = useState(false);
    

    useEffect(() => {
        const obtenerRegistroTransacciones = async () => {
            if (!user) return;
            const anhoActual = new Date().getFullYear();
            try {
                setLoading(true);
                const response = await transaccionesService.getTransaccionesSocioCompletoPorMes(user.id_socio, mesSeleccionado, anhoActual);
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

    const actualizarTransacciones = async (mes = mesSeleccionado) => {
        const anhoActual = new Date().getFullYear();
        const transaccionesRespuesta = await transaccionesService.getTransaccionesSocioCompletoPorMes(user.id_socio, mes, anhoActual);
        setRegistroTransacciones(transaccionesRespuesta);
    }

    const handleMesSeleccionado = (mes) => {
                setMesSeleccionado(mes);
                try{
                    actualizarTransacciones(mes);
                    setTimeout(() => {
                        setLoading(false);
                    }, 500); // Simulate a delay for loading state
    
                } catch (error) {
                    console.error("Error fetching noticias por fecha:", error);
                }
        }

    
    let estadoPagoUnidad = 0;
    let unidadTransaccion = '';
         

    const handlePagar = async (transaccion) => {
        setLoading(true);
        try{
            const transaccionData = {
                id_pago_asociado: transaccion.id_pago_asociado,
                id_billetera: user.id_billetera,
                id_tipo_transaccion: transaccion.id_tipo_transaccion,
                monto: transaccion.total_transaccion
            }
            if(TIPOS_TRANSACCION.RECARGA == transaccionData.id_tipo_transaccion){
                response = await billeteraService.validarRecarga(transaccionData);
            }else{
                response = await transaccionesService.pagarTransaccion(transaccionData);
            }
            
            if(response) {
                setShowExitosoModal(true);

                actualizarSaldoBilletera()

                setTimeout(() => {
                    actualizarTransacciones();
                }, 500);

            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
        } finally{
            setLoading(false);

            setTimeout(() => {
                setShowExitosoModal(false); // Cerrar modal de éxito después de 2
            }, 2000);

        }


            // Actualiza
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
                <h2>Transacciones</h2>
            </div>

            <MesSelector mesSeleccionado={mesSeleccionado} handleMesSeleccionado={(mes) => handleMesSeleccionado(mes)} />


            <div className="payments-container">

            {registroTransacciones.map((payment, idx) => (

                estadoPagoUnidad = payment.estado_transaccion,

                unidadTransaccion = payment.id_tipo_transaccion == TIPOS_TRANSACCION.MENSUALIDAD ? ['Mensualidad', 'Mensualidades'] : 
                                    payment.id_tipo_transaccion == TIPOS_TRANSACCION.RESERVACION ? ['Hora Reservada', 'Horas Reservadas'] : 
                                    payment.id_tipo_transaccion == TIPOS_TRANSACCION.COMPRA_COMERCIO ? ['Producto', 'Productos'] : 
                                    payment.id_tipo_transaccion == TIPOS_TRANSACCION.SERVICIO ? ['Hora Reservada', 'Horas Reservadas'] : ['Unidad', 'Unidades'],

                <div className={`detail-card ${estadoPagoUnidad ? 'pago' : 'pendiente'}`} key={idx}
                    onClick={() => handleHistoryItemClick(payment.id_billetera_transaccion)}
                >
                    <div className={`payment-header ${estadoPagoUnidad ? 'pago' : 'pendiente'}`}>
                        <h3 className='payment-title'>{payment.tipo_transaccion}</h3>
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
                {estadoPagoUnidad == 0 && payment.id_tipo_transaccion !== TIPOS_TRANSACCION.RECARGA && (
                    <Button
                        className='primary'
                        onClick={(e) => {
                            e.stopPropagation(); // Detiene la propagación del evento
                            handlePagar(payment)}
                        }
                    >
                        Pagar
                    </Button>
                    
                ) }

                </div>
            </div>)
            )}

                {registroTransacciones.length === 0 && (
                <div className="no-payments-container">
                    <p className="no-payments-message">No hay pagos registrados.</p>
                    
                </div>
                )
                }

            </div>
            {/* Si no hay pagos, mostrar un mensaje */}
            
        </div>
        </React.Fragment>
    );
};

export default PaymentDetail;