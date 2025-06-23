import React from 'react';
import './ButtonsRow.css';

import Button from './Button'; // Asegúrate de que la ruta sea correcta

const ButtonsRow = ({ buttons }) => {
  return (
    <div className="buttons-row">
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          type={button.type}
          className={button.className}
          disabled={button.disabled}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}

export default ButtonsRow;