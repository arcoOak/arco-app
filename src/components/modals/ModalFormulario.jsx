import React, {useState, useEffect} from 'react';
import './ModalFormulario.css'; // Asegúrate de que la ruta sea correcta

import Button from '../buttons/Button';

export default function ModalFormulario({ visible, onClose, onSubmit, titulo, children }) {
    if (!visible) {
        return null;
    }

    // Este manejador ahora solo notifica al padre del intento de envío.
    // No llama a onClose(). El padre decidirá si cerrar el modal.
    const handleSubmit = (event) => {
        event.preventDefault(); // Previene la recarga de la página
        if (onSubmit) {
            onSubmit(event); // Llama a la función del padre (handleModalSubmit)
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form className='modal-form' onSubmit={handleSubmit}>
                    <h2 className="modal-header">{titulo}</h2>
                    <div className="modal-body">
                    {children}
                    </div>
                    <div className="modal-actions">
                        <Button type="submit" className="primary">Guardar</Button>
                        <Button type="button" className="neutral" onClick={onClose}>Cancelar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}