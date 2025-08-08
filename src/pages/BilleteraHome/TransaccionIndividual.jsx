// src/components/PaymentDetail.jsx
import React, { useState, useEffect, useMemo  } from 'react'; // Importa useState
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './TransaccionIndividual.css';

import LoadingModal from '../../components/modals/LoadingModal'; // Importa el componente de modal de carga

import billeteraService from '../../services/billetera.service'; // Importa el servicio de billetera

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación
import BotonVolver from '../../components/buttons/ButtonVolver';

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

    const { user } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const [registroTransaccion, setRegistroTransaccion] = useState(); // 
    const [listaElementosTransaccion, setListaElementosTransaccion] = useState([]); // Estado para manejar los elementos de la transacción

    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos



    useEffect(() => {

        const obtenerRegistroTransaccion = async () => {
            try {
                const response = await billeteraService.getTransaccionPorId(id);
                console.log(response);

                const { transaccion, listaElementosTransaccion } = response; // Desestructura la transacción del objeto de respuesta

                setRegistroTransaccion(transaccion);
                setListaElementosTransaccion(listaElementosTransaccion);
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

        


    },[user] );



    if (!registroTransaccion || registroTransaccion.length === 0) {
        return (
            <div className="payment-detail-container">
                <h2>Detalle del Pago no encontrado</h2>
                <button className="back-button" onClick={() => navigate(backLocation)}>Volver al Inicio</button>
            </div>
        );
    }


    return (
        <React.Fragment>
            <LoadingModal visible={loading}></LoadingModal>
        <div className="payment-detail-container">

            <BotonVolver to={backLocation} />

            <div className="detail-header">
                <h2>Detalle de Pago</h2>
            </div>

            <div className="payments-container">

                    <div className={`detail-card ${registroTransaccion.estado_transaccion ? 'pago' : 'pendiente'}`} >
                        <div className={`payment-header ${registroTransaccion.estado_transaccion ? 'pago' : 'pendiente'}`}>
                            <p className='payment-title'>{registroTransaccion.tipo_transaccion}</p>
                        </div>
                        <div className="payment-details">
                        <p className='payment-date'><strong>Fecha: </strong> {formatDate(registroTransaccion.fecha_generacion)}</p>
                        <p className='payment-amount'><strong>Monto: </strong> ${registroTransaccion.total_transaccion}</p>

                        {/* La hora y referencia solo se muestran si ya está pagado */}
                        {
                        registroTransaccion.estado_transaccion == 1 && (
                            <>
                                <p><strong>Fecha de Pago:</strong> {formatDate(registroTransaccion.fecha_transaccion)}</p>
                            </>
                        )}

                        <table className={'payment-tabla-elementos'}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Coste</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                listaElementosTransaccion.map((elemento, index) => (
                                    <tr key={index} className="payment-elemento">
                                        <td>{elemento.nombre_transaccion}</td>
                                        <td>{elemento.cantidad}</td>
                                        <td>{elemento.coste_total}</td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>

                </div>
            </div>
            
            </div>
            
        </div>
        </React.Fragment>
    )
    };

export default TransaccionIndividual;