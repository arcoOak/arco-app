import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './HorarioSeleccionable.css';

const horariosEjemplo = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
];

const horariosNoDisponiblesPrueba = [
  '09:00 - 10:00',
  '13:00 - 14:00',
];





const HorarioSeleccionable = ({ fecha }) => {

      const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);


    const handleSeleccion = (horario) => {
        setHorarioSeleccionado(horario);
    };

    const handleGuardar = () => {
        // Aquí puedes agregar la lógica para guardar la reserva
        alert(`Horario guardado: ${horarioSeleccionado} para el día ${moment(fecha).format('DD/MM/YYYY')}`);
    };

  return (
    <div className="horario-seleccionable-container">
      <h4>Selecciona un horario para el día {moment(fecha).format('DD/MM/YYYY')}</h4>
      <div className="horario-lista">
        {horariosEjemplo.map((horario, idx) => {
          const noDisponible = horariosNoDisponiblesPrueba.includes(horario);
          return (
            <button
              key={idx}
              className={"horario-btn "+ (noDisponible ? 'no-disponible' : 'disponible')}
              disabled={noDisponible}
              onClick={() => !noDisponible && handleSeleccion(horario)}
            >
              {horario} {noDisponible}
            </button>
          );
        })}
      </div>
      {horarioSeleccionado && (
        <button
          className="horario-btn"
          style={{ marginTop: '18px', background: '#007bff', width: '60%' }}
          onClick={handleGuardar}
        >
          Guardar
        </button>
      )}
    </div>
  );
};

export default HorarioSeleccionable;