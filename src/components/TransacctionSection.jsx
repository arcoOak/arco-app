import React, { useState, useEffect } from 'react';
import "../css/DashboardHome.css";
import Transacctions from "./Transacctions";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { useAuth } from '../context/AuthContext'; // Import useAuth

import transaccionesService from "../services/transacciones.service";

import Button from './buttons/Button';

export default function TransacctionSection() {

    const [ultimasTransacciones, setUltimasTransacciones] = useState([]);

    const { user } = useAuth();

    const statPay = 'pay';
    const amount = 500;

    useEffect( () =>{
        const cargarUltimasTransacciones = async () =>{
            try {

                const transacciones = await transaccionesService.getUltimasTransaccionesSocio(user.id_socio);
                setUltimasTransacciones(transacciones);

            } catch (error){
                console.error('Error al cargar últimas transacciones: ', error)
            }
        }

        if(user){
            cargarUltimasTransacciones();
        }
    }, [user])

    const navigate = useNavigate();

    const handleHistoryItemClick = (id_billetera_transaccion) => {
        if(id_billetera_transaccion && id_billetera_transaccion !== null) {
            navigate(`/transaccion/${id_billetera_transaccion}`, { state: { returnTo: location.pathname } });
        }
        
    };

    return (
        <div className="dashboard-container">
            <section className="investments-section">
                <div className="investments-header">
                    <h3 className=''>Últimas Transacciones</h3>

                    <Button 
                        onClick={() => navigate('/transaccion')}
                        className='primary'
                    >
                        Ver Todo
                    </Button>

                </div>
                <div className="statistics-placeholder">
                    {ultimasTransacciones.map(item => (
                        <div
                            key={item.id_billetera_transaccion}
                            onClick={() => handleHistoryItemClick(item.id_billetera_transaccion)}
                            className={`history-item-clickable`}
                        >
                            <Transacctions
                                id={item.id_billetera_transaccion}
                                descripcion_transaccion={item.descripcion_transaccion}
                                monto={item.monto}
                                fecha_transaccion={item.fecha_transaccion}
                                nombre_transaccion={item.nombre_transaccion}
                                classAmount={`${item.monto < 0 ? 'negative' : 'positive'}`}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
