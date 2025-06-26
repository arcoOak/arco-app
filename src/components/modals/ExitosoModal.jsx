import React from 'react';
import './ExitosoModal.css';

const ExitosoModal = ({ visible = false, mensaje = "¡Operación exitosa!" }) => {
  if (!visible) return null;
  return (
    <div className="exitoso-modal-overlay">
      <div className="exitoso-modal-content">
        <div className="exitoso-check-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <span className='exitoso-mensaje'>{mensaje}</span>
      </div>
    </div>
  );
};

export default ExitosoModal;