// src/components/PaymentDetail.jsx
import React, { useState, useEffect, useMemo  } from 'react'; // Importa useState
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './TransaccionIndividual.css';

import LoadingModal from '../../components/modals/LoadingModal'; // Importa el componente de modal de carga
import ExitosoModal from '../../components/modals/ExitosoModal';

import transaccionesService from '../../services/transacciones.service'; // Importa el servicio de billetera

import billeteraService from '../../services/billetera.service.js';

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import BotonVolver from '../../components/buttons/ButtonVolver';
import Button from '../../components/buttons/Button';

import {TIPOS_TRANSACCION } from '../../constants/transaccion.constants';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
};


const TransaccionIndividual = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const location = useLocation(); // Obtiene la ubicación actual para manejar la navegación
    const backLocation = location.state?.returnTo || '/transaccion'; // Define la ruta de retorno

    const { user, actualizarSaldoBilletera } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const [registroTransaccion, setRegistroTransaccion] = useState(); // 
    const [listaElementosTransaccion, setListaElementosTransaccion] = useState([]); // Estado para manejar los elementos de la transacción

    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const [showExitosoModal, setShowExitosoModal] = useState(false);

    useEffect(() => {

        const obtenerRegistroTransaccion = async () => {
            try {
                const response = await transaccionesService.getTransaccionPorId(id);
                console.log(response);

                const { transaccion, datosTransaccion } = response; // Desestructura la transacción del objeto de respuesta

                setRegistroTransaccion(transaccion);
                setListaElementosTransaccion(datosTransaccion);
            } catch (error) {
                console.error('Error al obtener el registro de transacciones:', error);
            }finally{
                setTimeout( () => {
                    setLoading(false); // Cambia el estado de carga a false después de 1 segundo
                }, 500)
            }
        };

        if(user) {
             // Cambia el estado de carga a true cuando comienza la carga
            obtenerRegistroTransaccion();
        }

    },[user, id] );

    const actualizarTransaccion = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await transaccionesService.getTransaccionPorId(id);
            console.log(response);
            setRegistroTransaccion(response.transaccion);
            setListaElementosTransaccion(response.datosTransaccion);
        } catch (error) {
            console.error('Error al obtener el registro de transacciones:', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    };

    const handlePagar = async () => {
            setLoading(true);
            try{
                
                const transaccionData = {
                    id_pago_asociado: registroTransaccion.id_pago_asociado,
                    id_billetera: user.id_billetera,
                    id_tipo_transaccion: registroTransaccion.id_tipo_transaccion,
                    monto: (registroTransaccion.monto)
                }


                console.log('Datos de transacción:', transaccionData);

                let response;

                if(TIPOS_TRANSACCION.RECARGA == transaccionData.id_tipo_transaccion){
                    response = await billeteraService.validarRecarga(transaccionData);
                }else{
                    response = await transaccionesService.pagarTransaccion(transaccionData);
                }
                
                if(response) {
                    setShowExitosoModal(true);

                    actualizarSaldoBilletera();

                    setTimeout(() => {
                        actualizarTransaccion();
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
    
    
        }



    if (!registroTransaccion || registroTransaccion.length === 0) {

        return (
            <React.Fragment>
                <BotonVolver to={backLocation} />
            <div className="payment-detail-container">
                <h2>Detalle del Pago no encontrado</h2>
                <button className="back-button" onClick={() => navigate(backLocation)}>Volver al Inicio</button>
            </div>
        </React.Fragment>
        );
    }


    return (
        <React.Fragment>
            <LoadingModal visible={loading}></LoadingModal>
            <ExitosoModal 
                visible={showExitosoModal} 
                mensaje='¡Pago con éxito!'  
            />

        <BotonVolver to={backLocation} />

        <div className="payment-individual-detail-container">


            <div className="payments-individual-container">

                <div className={`payment-individual-header ${registroTransaccion.estado_transaccion ? 'pago' : 'pendiente'}`}>
                    <h2 className='payment-title-individual'>{registroTransaccion.tipo_transaccion}</h2>
                </div>
                <div className="payment-individual-details">
                    <p className='payment-individual-date'><strong>Fecha: </strong> {formatDate(registroTransaccion.fecha_generacion)}</p>
                    <p className='payment-individual-amount'><strong>Monto Total: </strong> ${registroTransaccion.monto}</p>

                    {/* La hora y referencia solo se muestran si ya está pagado */}
                    {registroTransaccion.estado_transaccion === 1 && (
                        <p><strong>Fecha de Pago:</strong> {formatDate(registroTransaccion.fecha_transaccion)}</p>
                    )}

                    <table className={'payment-individual-tabla-elementos'}>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                        {listaElementosTransaccion.map((elemento, index) => (
                            <tr key={index} className="payment-individual-elemento">
                                <td>{elemento.nombre_transaccion}</td>
                                <td>{elemento.cantidad}</td>
                                <td>${elemento.coste_total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {registroTransaccion.estado_transaccion === 0 && registroTransaccion.id_tipo_transaccion != TIPOS_TRANSACCION.RECARGA && (
                        <Button
                            className='primary'
                            onClick={(e) => {
                                e.stopPropagation(); // Detiene la propagación del evento
                                handlePagar();
                            }}
                        >
                            Pagar
                        </Button>
                    )}
                </div>
            </div>
        </div>
        </React.Fragment>
    )
    };


export default TransaccionIndividual;