import React from 'react';
import './ConfirmarModal.css';

const ConfirmarModal = ({
  visible = false,
  mensaje = "¿Estás seguro?",
  onConfirm, onCancel
}) => {
  if (!visible) return null;



  return (
    <div className="confirmar-modal-overlay">
      <div className="confirmar-modal-content">
        <div className="confirmar-icon">
          <i className="fas fa-question-circle"></i>
        </div>
        <span className="confirmar-mensaje">{mensaje}</span>
        <div className="confirmar-botones">
          <button className="confirmar-btn confirmar-btn-si" onClick={onConfirm}>
            <i className="fas fa-check"></i> Sí
          </button>
          <button className="confirmar-btn confirmar-btn-no" onClick={onCancel}>
            <i className="fas fa-times"></i> No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmarModal;