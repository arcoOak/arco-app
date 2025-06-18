import React from 'react';
import './LoadingModal.css';

const LoadingModal = ({ visible = false, mensaje = "Cargando..." }) => {
  if (!visible) return null;
  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal-content">
        <div className="loading-spinner"></div>
        <span>{mensaje}</span>
      </div>
    </div>
  );
};

export default LoadingModal;