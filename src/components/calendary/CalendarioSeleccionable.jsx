import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import './CalendarioSeleccionable.css'; 
import LoadingModal from '../modals/LoadingModal';

const CalendarioSeleccionable = ({ canchaId, titulo, selectedDate, setSelectedDate }) => {
//   const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());


  // Función para simular la obtención de disponibilidad desde una API
  // En un caso real, aquí harías una llamada a tu API RESTful
  const fetchAvailability = async (idCancha, dateForMonth) => {
    setLoading(true);
    setError(null);
    try {
      // Simula una respuesta de API con algunas fechas disponibles
      // Reemplaza esto con tu llamada real a la API
      const response = await new Promise(resolve => setTimeout(() => {
        const today = moment(dateForMonth);
        const dates = [];

        dates.push(today.date(5).format('YYYY-MM-DD')); // Día 5 del mes
        dates.push(today.date(12).format('YYYY-MM-DD')); // Día 12 del mes
        dates.push(today.date(20).format('YYYY-MM-DD')); // Día 20 del mes

        // Añadir una fecha del mes siguiente para demostrar
        const nextMonth = moment(dateForMonth).add(1, 'month');
        dates.push(nextMonth.date(3).format('YYYY-MM-DD'));

        // Añadir una fecha del mes anterior para demostrar
        const prevMonth = moment(dateForMonth).subtract(1, 'month');
        dates.push(prevMonth.date(25).format('YYYY-MM-DD'));

        resolve({ data: dates });
      }, 1000)); // Simula un delay de red

      setAvailableDates(response.data.map(date => moment(date))); // Convertir a objetos moment
      setLoading(false);
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError("No se pudo cargar la disponibilidad. Intente de nuevo.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canchaId) {
      fetchAvailability(canchaId, currentViewDate);
    }
  }, [canchaId, currentViewDate]);

  // Función para determinar si una fecha debe ser marcada como disponible
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const isAvailable = availableDates.some(availDate => moment(availDate).format('YYYY-MM-DD') === formattedDate);
      return isAvailable ? 'available-day' : 'not-available-day';
    }
    return null;
  };

  const handleDateChange = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const isAvailable = availableDates.some(availDate => moment(availDate).format('YYYY-MM-DD') === formattedDate);

    if (isAvailable) {
      setSelectedDate(date);
      // Aquí puedes añadir más lógica, como mostrar un modal para reservar
    } else {
      setSelectedDate(null); // Deseleccionar si no está disponible
    }
  };

   const handleViewChange = ({ activeStartDate, view }) => {
    if (view === 'month') {
      setCurrentViewDate(activeStartDate); // Actualizamos la fecha de la vista actual
    }
  };

  if (loading) return <LoadingModal visible='true'>Cargando disponibilidad...</LoadingModal>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="cancha-calendar-container">
      <h3>{titulo}</h3>
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileClassName={tileClassName}
        activeStartDate={currentViewDate} 
        onActiveStartDateChange={handleViewChange} // Nuevo prop para escuchar el cambio de mes
        // Los siguientes props son opcionales pero útiles para la navegación
        //showNavigation={true} // Muestra las flechas de navegación
        // showNeighboringMonth={false} // Evita mostrar días de meses vecinos
        minDate={new Date()} // Opcional: Para evitar seleccionar fechas pasadas
        maxDate={moment().add(1, 'month').toDate()} // Opcional: Limita la selección a un mes en el futuro
        next2Label={null} // Oculta el botón de mes siguiente
        prev2Label={null} // Oculta el botón de mes anterior
        selectRange={false} // Desactiva la selección de rango
        onDrillUp={()=>{}}
      />
      {selectedDate && (
        <p>
          Día seleccionado: <b>{moment(selectedDate).format('DD/MM/YYYY')}</b>
        </p>
      )}
    </div>
  );
};

export default CalendarioSeleccionable;