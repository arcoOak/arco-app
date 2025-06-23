import React from 'react';
import './SmallIconBox.css'; // Asegúrate de tener un archivo CSS para estilos

//Importar fast para iconos de Font Awesome



// Asegúrate de tener Font Awesome incluido en tu proyecto (por CDN en index.html o instalado como paquete)
const SmallIconBox = ({ titulo, icono = "fa-star", dato= "" }) => (
  <div className="small-icon-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <i className={`fas ${icono} small-icon-box__icon`} aria-hidden="true"></i>
    <div>
        <h2 className="small-icon-box__title">{titulo}</h2>
        {dato && <span className="small-icon-box__data">{dato}</span>}
    </div>
  </div>
);

export default SmallIconBox;