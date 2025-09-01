import React, { useState, useEffect } from "react";
import "../../css/DashboardHome.css";

import { useAuth } from "../../context/AuthContext";

import billeteraService from "../../services/billetera.service";

import data_dbService from "../../services/data_db.service";

import ModalFormulario from "../modals/ModalFormulario";

export default function TarjetaRecargar() {

    const {user, actualizarSaldoBilletera} = useAuth();

    const [monto, setMonto] = useState(0);
    const [metodosPago, setMetodosPago] = useState([]);
    const [metodoSeleccionado, setMetodoSeleccionado] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMetodosPago = async () => {
            const metodos = await data_dbService.getMetodosPago();
            setMetodosPago(metodos);
        };
        fetchMetodosPago();
    }, []);

    const recargarSaldo = async () => {
        try {

            const recargarData = {
                id_billetera: user.id_billetera,
                monto: parseFloat(monto), // Establece el monto que deseas recargar
                metodoSeleccionado: parseInt(metodoSeleccionado) // Asegúrate de que sea un número
            }

            console.log('Datos de recarga:', recargarData);

            const response = await billeteraService.recargarSaldo(recargarData);
            console.log('Respuesta de recarga:', response);
            if (response) {
                //Actualizar el saldo en el contexto o estado
                actualizarSaldoBilletera();
            }
        } catch (error) {
            console.error('Error al recargar saldo:', error);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        // Resetea los campos del formulario al cerrar
        setMonto(0);
        setMetodoSeleccionado('');
    };

    const handleModalSubmit = async (event) => {
        // Es una buena práctica prevenir el comportamiento por defecto del formulario.
        if (event) event.preventDefault();
        console.log('Monto a recargar:', monto);
        console.log('Método de pago seleccionado:', metodoSeleccionado);
        
        // Validador: comprueba si los datos son inválidos y sale de la función
        if (!monto || parseFloat(monto) <= 0 || !metodoSeleccionado) {
            console.log("Validación fallida. El modal no debería cerrarse.");
            // Si el modal se sigue cerrando, el problema reside en el componente ModalFormulario,
            // que podría estar llamando a onClose incondicionalmente.
            return;
        }

        await recargarSaldo();
        handleModalClose(); // Cierra y resetea el modal
    };

    return (
        <React.Fragment>
            <ModalFormulario
                visible={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                titulo="Recargar Saldo"
                data={{ monto, metodoSeleccionado }}
            >
                    <label className="box-form-container-label" htmlFor="monto">Monto:</label>
                    <input className="box-form-container-input"
                        type="number"
                        id="monto"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        required
                        min="1"
                    />
                    <label className="box-form-container-label" htmlFor="metodo">Método de Pago:</label>
                    <select
                        id="metodo"
                        value={metodoSeleccionado}
                        onChange={(e) => setMetodoSeleccionado(e.target.value)}
                        className="box-form-container-input"
                        required
                    >
                        <option value="" disabled>Seleccionar</option>
                        {metodosPago.map((metodo) => (
                            <option key={metodo.id_metodo_pago} value={metodo.id_metodo_pago}>
                                {metodo.nombre_metodo_pago}
                            </option>
                        ))}
                    </select>
            </ModalFormulario>
            <div className="balance-section">
                <div className="balance-actions">
                    <div className="balance-button">
                        
                        <button onClick={() => setIsModalOpen(true)}>
                            <i className="fa-solid fa-wallet"></i>
                            <label>Recargar</label>
                        </button>
                        
                    </div>
                    
                </div>
            </div>
        </React.Fragment>
    );
}
