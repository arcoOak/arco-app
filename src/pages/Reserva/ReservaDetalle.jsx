import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from 'react';
import './ReservaDetalle.css'; // Crea un archivo CSS para este componente

const reservaProducts = [
    { id: 1, name: 'Hamburguesa Clásica', description: 'La original con queso y lechuga.', price: 'Bs. 550', img: '../src/img/productos/hamburguesa.jpg' },
];

export default function ReservaDetalle({ concesionarios }) { // Recibe concesionarios como prop
    const { id } = useParams();
    const navigate = useNavigate(); // Hook para navegar programáticamente

    // Buscar el espacio por ID
    const espacio = concesionarios.find(b => b.id === parseInt(id));

    if (!espacio) {
        return (
            <div className="reserva-container no-comercio">
                <h2>Espacio no encontrado.</h2>
                <button className="back-button" onClick={() => navigate('/reservas')}>Volver a Tiendas</button>
            </div>
        );
    }

    // Obtener la fecha actual
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth(); // 0 for Jan, 1 for Feb, etc.
    const currentYear = today.getFullYear();

    // Estados para el mes y año seleccionados
    const [selectedMonth, setSelectedMonth] = useState(currentMonth); // Default to current month
    const [selectedYear, setSelectedYear] = useState(currentYear);   // Default to current year
    const [selectedDate, setSelectedDate] = useState(currentDay); // Default to current day, or a valid future day if current day is disabled

    const [hour, setHour] = useState('11');
    const [minute, setMinute] = useState('00');
    const [ampm, setAmpm] = useState('AM');

    // Dummy data for calendar days (adjust for actual month logic if needed)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Función para obtener el número de días en un mes específico
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Función para obtener el primer día de la semana del mes (0=Dom, 1=Lun...)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

    // Generar las fechas del mes actual
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Efecto para ajustar selectedDate si el día actual ya pasó o no existe en el nuevo mes/año
    useEffect(() => {
        // Si el día seleccionado es mayor que los días en el nuevo mes, ajustarlo al último día del mes
        if (selectedDate > daysInMonth) {
            setSelectedDate(daysInMonth);
        }

        // Si el mes o año cambia a uno anterior al actual, ajustar la fecha al día actual si es válido
        const currentMonthAndYear = new Date(currentYear, currentMonth);
        const selectedMonthAndYear = new Date(selectedYear, selectedMonth);

        if (selectedMonthAndYear < currentMonthAndYear) {
            // Si el mes/año seleccionado es anterior al actual, forzar la selección al primer día del mes/año actual
            setSelectedMonth(currentMonth);
            setSelectedYear(currentYear);
            setSelectedDate(currentDay); // O podrías poner 1 si quieres el 1ro del mes
        } else if (selectedMonthAndYear.getTime() === currentMonthAndYear.getTime()) {
            // Si es el mes y año actual, asegúrate de que el día seleccionado no sea anterior al día actual
            if (selectedDate < currentDay) {
                setSelectedDate(currentDay);
            }
        }
    }, [selectedMonth, selectedYear, daysInMonth, selectedDate, currentDay, currentMonth, currentYear]);


    const handleProceedNext = () => {
        const monthName = new Date(selectedYear, selectedMonth).toLocaleString('es-ES', { month: 'long' });
        alert(`Reserva para el ${selectedDate} de ${monthName} de ${selectedYear} a las ${hour}:${minute} ${ampm}`);
        // En una aplicación real, navegarías al siguiente paso y pasarías estos datos
    };

    const handleDateClick = (date) => {
        const selectedDateTime = new Date(selectedYear, selectedMonth, date);
        if (selectedDateTime < today.setHours(0, 0, 0, 0)) { // Comparar solo las fechas, ignorar la hora
            // No hacer nada si la fecha ya pasó
            return;
        }
        setSelectedDate(date);
    };

    // --- MODIFICACIÓN AQUÍ para los meses ---
    const getMonthOptions = () => {
        const months = [];
        const monthNames = [];
        for (let i = 0; i < 12; i++) {
            monthNames.push(new Date(2000, i).toLocaleString('es-ES', { month: 'long' }));
        }

        // Si el año seleccionado es el actual, mostrar solo desde el mes actual en adelante
        if (selectedYear === currentYear) {
            for (let i = currentMonth; i < 12; i++) {
                months.push({ value: i, name: monthNames[i] });
            }
        } else {
            // Si el año es futuro, mostrar todos los meses
            for (let i = 0; i < 12; i++) {
                months.push({ value: i, name: monthNames[i] });
            }
        }
        return months;
    };

    // --- MODIFICACIÓN AQUÍ para los años ---
    const getYearOptions = () => {
        const years = [];
        const startYear = currentYear;
        const endYear = currentYear + 1; // Solo el año actual y el siguiente para ver la funcionalidad si necesitas expandirlo, pero la instrucción es solo el actual.
        // Para solo el año actual, puedes cambiar `endYear` a `currentYear`.
        for (let i = startYear; i <= endYear; i++) { // Loop solo para asegurar que al menos el año actual está
            years.push(i);
        }
        return years;
    };

    const monthOptions = getMonthOptions();
    const yearOptions = getYearOptions();


    return (
        <>
            <div className="reserva-header">
                <button className="back-button" onClick={() => navigate('/reservas')}>
                    <i className='bx bx-arrow-back'></i> Volver
                </button>
                {/* <img src={`../${espacio.img}`} alt={espacio.name} className="reserva-img" /> */}
                <h1>{espacio.name}</h1>
                <p className="detalle-description">{espacio.description}</p>
            </div>

            <div className="reserva-container">

                <div className="booking-container">
                    <main className="booking-main-content">
                        <section className="date-section">
                            <div className='date-selectors-container'>
                                <div className="date-selectors">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    >
                                        {monthOptions.map(month => (
                                            <option key={month.value} value={month.value}>{month.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        disabled={true}
                                    >
                                        <option value={currentYear}>{currentYear}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="calendar-grid">
                                {daysOfWeek.map(day => (
                                    <div key={day} className="day-of-week">{day}</div>
                                ))}
                                {/* Celdas vacías para alinear el primer día del mes */}
                                {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} className="calendar-day empty"></div>)}
                                {dates.map(date => {
                                    // Crear un objeto Date para el día actual en el bucle
                                    const dayInCalendar = new Date(selectedYear, selectedMonth, date);
                                    // Normalizar today a inicio del día para la comparación
                                    const todayStart = new Date(currentYear, currentMonth, currentDay);
                                    const isPastDate = dayInCalendar < todayStart;
                                    const isSelected = date === selectedDate;

                                    return (
                                        <div
                                            key={date}
                                            className={`calendar-day ${isSelected ? 'selected' : ''} ${isPastDate ? 'disabled' : ''}`}
                                            onClick={() => handleDateClick(date)}
                                        >
                                            {date}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="time-section">
                            <label>Hora</label>
                            <div className="time-inputs">
                                <div className="time-input-group hour-group">
                                    <input
                                        type="text"
                                        className="time-input hour-input"
                                        value={hour}
                                        onChange={(e) => setHour(e.target.value)}
                                        maxLength="2"
                                    />

                                </div>
                                <div className="time-input-group">
                                    <span className="time-colon">:</span>
                                </div>
                                <div className="time-input-group minute-group">
                                    <input
                                        type="text"
                                        className="time-input minute-input"
                                        value={minute}
                                        onChange={(e) => setMinute(e.target.value)}
                                        maxLength="2"
                                    />
                                </div>
                                <div className="ampm-toggle">
                                    <button
                                        className={`ampm-button ${ampm === 'AM' ? 'active' : ''}`}
                                        onClick={() => setAmpm('AM')}
                                    >
                                        AM
                                    </button>
                                    <button
                                        className={`ampm-button ${ampm === 'PM' ? 'active' : ''}`}
                                        onClick={() => setAmpm('PM')}
                                    >
                                        PM
                                    </button>
                                </div>
                            </div>
                        </section>
                    </main>

                    <footer className="booking-footer">
                        <button className="proceed-button" onClick={handleProceedNext}>
                            Reservar
                        </button>
                    </footer>

                    {espacio.category == 'Deportes' && (
                        <div className='reserve-lessons-container'>
                            <div className="reserve-lessons">
                                <div className="img_reserve">
                                    <img src="../src/img/reservas/coach-1.jpg" alt="Reserva" />
                                </div>
                                <div className="info_reserve">
                                    <h4>Reserva una lección con un entrenador</h4>
                                    <p>Trabaja con los mejores entrenadores!</p>
                                    <button className="btn btn-primary">Reservar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}