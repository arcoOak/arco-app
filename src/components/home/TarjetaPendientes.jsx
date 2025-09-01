import React, { useState, useMemo, useRef, useEffect, use  } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./TarjetaPendientes.css";

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import transaccionesService from '../../services/transacciones.service';

import Button from '../buttons/Button'; // Asegúrate de que la ruta sea correcta

export default function Balance() {

    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1); 

    const statusColorPayment = '#22ad82';

    const { user } = useAuth(); // Obtiene el usuario del contexto de autenticación

    const [ pagosPendientes, setPagosPendientes ] = useState([]);

    const [ mesesConDeuda, setMesesConDeuda ] = useState(new Set());

    const navigate = useNavigate();

    const monthsRef = useRef({});

    let [totalDeuda, setTotalDeuda] = useState(0);


    useEffect(() => {
        const obtenerPagosPendientes = async () => {
            try {
                const response = await transaccionesService.getTransaccionesPendientes(user.id_socio);

                //console.log('Pagos pendientes:', response);
                setPagosPendientes(response);

                const totalDeuda = response.reduce((total, pago) => total + parseFloat(pago.total_transaccion), 0)

                setTotalDeuda(totalDeuda);

                const mesesDeudores = new Set(response.map(pago => new Date(pago.fecha_generacion).getMonth() + 1));
                setMesesConDeuda(mesesDeudores);

            } catch (error) {
                console.error('Error al obtener los pagos pendientes:', error);
            }
        };

        if (user?.id_socio) {
            obtenerPagosPendientes();
        }
    },[user])   



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
        navigate(`/transaccion/`, { state: { mes: id, backLocation: '/'} });
    };

    const handlePagarClick = () => {
        navigate('/pagar-pendientes');
    }

    return (
        <div className="dashboard-container">
            <section className="calendar-section">
                <div className="calendar-header">
                    <div>
                        <p>Adelanta duplica <i className="fa fa-gift"></i></p>
                    </div>

                    <Button onClick={handlePagarClick} className="primary">Pagar</Button>
                    
                </div>
                <div className="balance-body">
                    <div className="calendar-balance">

                        {
                            listaMeses.map((mes, index) => (


                                <div
                                    key={index}
                                    className={`calendar-item ${mes.numero == mesSeleccionado ? 'active-month' : ''}`}
                                    onClick={() => handleHistoryItemClick(mes.numero)}
                                    ref={el => monthsRef.current[mes.numero] = el}
                                >
                                    <p>{mes.nombre.slice(0, 3).toUpperCase()} </p>
                                    <i className="fa fa-circle" 
                                        style={{ color: mesesConDeuda.has(mes.numero) ? '#dc3545' : '#22ad82', fontSize: '11px' }}>
                                    </i>
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className="balance-footer">
                    <div>
                        <p className="recibos-balance">
                            {pagosPendientes.length} 
                            {pagosPendientes.length != 1 ? ' Recibos pendientes' : ' Recibo pendiente'}</p>
                    </div>
                    <div>
                        <p className={`total-balance ${totalDeuda < 0 ? 'has-debt' : 'no-debt'}`}>
                            {totalDeuda < 0 ? `${totalDeuda}$` : "Sin deuda"}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );

}