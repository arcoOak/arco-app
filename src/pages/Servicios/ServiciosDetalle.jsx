
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate
import './ServiciosDetalle.css'; // Crea un archivo CSS para este componente



import LoadingModal from '../../components/modals/LoadingModal';
import ExitosoModal from '../../components/modals/ExitosoModal';
import ServicioReservaModal from './ServicioReservaModal'; // Asegúrate de que la ruta sea correcta

import serviciosService from '../../services/servicios.service';

import reservaServicioService from '../../services/reservasServicio.service';

import {useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import ButtonVolver from '../../components/buttons/ButtonVolver'; // Importa el botón de volver

import {TIPOS_TRANSACCION} from '../../constants/transaccion.constants.js'; 

// Función para obtener el número de días en un mes específico
const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

    // Función para obtener el primer día de la semana del mes (0=Dom, 1=Lun...)
const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
};

const formatearHora = (hora) =>{

        if (!hora || typeof hora !== 'string' || hora.length < 5) {
            return ''; // Evitar errores si la hora no está definida o tiene un formato incorrecto
        }

        const horaInt = parseInt(hora.slice(0, 2), 10);
        const minutoStr = hora.slice(3, 5); // Mantener los minutos como string para el formato '00'

        let horaFormateada = horaInt;
        let ampm = 'am';

        if (horaInt >= 12) {
            ampm = 'pm';
            if (horaInt > 12) {
                horaFormateada = horaInt - 12;
            }
        }
        
        if (horaFormateada === 0) { // Para el caso de las 00:00 (medianoche)
            horaFormateada = 12;
        }

        return `${horaFormateada}:${minutoStr}${ampm}`;
    }

export default function ServiciosDetalle() {

    const { user, actualizarSaldoBilletera } = useAuth(); // Obtiene el usuario autenticado desde el contexto
    const { id } = useParams();
    const navigate = useNavigate(); // Hook para navegar programáticamente
    const [loading, setLoading] = useState(true); // Iniciar en true para la carga inicial
    const [showExitosoModal, setShowExitosoModal] = useState(false); // Estado para manejar el modal de éxito
    
    const [servicio, setServicio] = useState(null); // Estado para manejar el servicio consulado
    const [empresasReservadoras, setEmpresasReservadoras] = useState([]); // Estado para manejar las empresas reservadoras del servicio
    const [unidadSeleccionada, setUnidadSeleccionada] = useState(null); // Estado para manejar la unidad seleccionada

    const [horaApertura, setHoraApertura] = useState('');
    const [horaCierre, setHoraCierre] = useState(''); // Estado para manejar el horario de apertura y cierre del servicio
    const [costeReserva, setCosteReserva] = useState(0.00); // Estado para manejar el coste de la reserva

    const [listaHorarios, setListaHorarios] = useState([]); // Estado para manejar la lista de horarios disponibles
    const [listaHorariosSeleccionados, setListaHorariosSeleccionados] = useState([]); // Estado para manejar los horarios seleccionados

    const [listaHorariosYaReservados, setListaHorariosYasReservados] = useState([]); // Estado para manejar los horarios ya reservados
    const [listaHorariosYaReservadosPorEmpresa, setListaHorariosYaReservadosPorEmpresa] = useState([]); // Estado para manejar los horarios ya reservados por empresa

    const [showServicioReservaModal, setShowServicioReservaModal] = useState(false); // Estado para manejar la visibilidad del modal de reserva
    const [notaReserva, setNotaReserva] = useState('');

    const location = useLocation();
    const backLocation = location.state?.returnTo || '/servicios'; // Ruta a la que volver, por defecto a /servicios


    useEffect(() => {

            const fetchData = async () => {
                setLoading(true)
                try {
    
                    // Obtener el espacio y sus unidades
                    const [servicioConsultado, unidadesData] = await Promise.all([
                        serviciosService.getServicioPorId(id),
                        serviciosService.getEmpresasReservadorasPorServicio(id)
                    ]);


                    if (!servicioConsultado) {
                        console.error('Comercio no encontrado');
                        setServicio(null); // Si no se encuentra el comercio, establecemos comercio como null
                        setEmpresasReservadoras([]); // Si no se encuentra el comercio, establecemos productos como un array vacío
                    }else{

                        setServicio(servicioConsultado);
                        setHoraApertura(unidadesData[0]?.hora_apertura_servicio || servicioConsultado.hora_apertura_servicio || ''); // Establece un valor por defecto si no hay hora de apertura
                        setHoraCierre(unidadesData[0]?.hora_cierre_servicio || servicioConsultado.hora_cierre_servicio || '');

                        setCosteReserva(unidadesData[0]?.costo_servicio || servicioConsultado.costo_servicio || 0.00); // Establece un valor por defecto si no hay coste de reserva

                        setEmpresasReservadoras(unidadesData || []); // Si no hay unidades, se establece un array vacío
                        setUnidadSeleccionada(unidadesData[0]?.id_servicio_reservable_empresa || null);


                        //console.log('Empresas Reservadoras:', unidadesData);
                        //Se carga por defecto a la fecha de hoy en formato YYYY-MM-DD

                        const fechaActualFormateada = new Date().toISOString().slice(0, 10)

                        // Cargar las reservas ya realizadas para el espacio
                        //console.log(unidadesData[0].id_espacio_reservable_unidad)
                        const reservasDelEspacio = await reservaServicioService.getHorasReservadasPorServicioPorFecha( id, fechaActualFormateada, user.id_club );
                        
                        setListaHorariosYasReservados((reservasDelEspacio || []).map(reserva => {
                            return {
                                id_servicio_reservable_empresa: reserva.id_servicio_reservable_empresa,
                                horaReserva: reserva.hora_reserva.slice(0, 2), // Extrae solo la hora en formato HH:mm
                                fecha: fechaActualFormateada
                            };
                        }));                        
                    }
                    

                } catch (error) {
                    console.error('Error fetching data:', error);
                    setServicio(null); // Si hay un error, establecemos comercio como null
                    setEmpresasReservadoras([]); // Si hay un error, establecemos productos como un array vacío
                } finally {
                    setLoading(false);
                }
                 // Finaliza la carga de datos
            };
            fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() =>{
            setListaHorarios(()=>{
                const lista = [];
                
                if (horaApertura && horaCierre) {
                    // Convertir las horas de apertura y cierre a minutos totales desde la medianoche
                    const aperturaHour = parseInt(horaApertura.split(':')[0]);
                    const cierreHour = parseInt(horaCierre.split(':')[0]);
                
                    // Generar los horarios en intervalos de 30 minutos
                    for (let i = aperturaHour; i <= cierreHour; i += 1) {
                        const hora = i < 10 ? `0${i}` : i; // Formatear la hora con dos dígitos
                        const nexHora = (i + 1) < 10 ? `0${i + 1}` : (i + 1); // Formatear la siguiente hora con dos dígitos
                        // Añadir AM/PM según la hora
                        const ampm = (i >= 12 && i < 24) ? 'PM' : 'AM';
                        const ampmNexHora = ((i + 1) >= 12 && (i + 1) < 24 || (i+1) === 24) ? 'PM' : 'AM';
                        
                        lista.push({
                            hora24: `${hora}`, // Hora en formato 24 horas
                            hora: `${hora > 12 ? hora - 12 : hora}:00 `,
                            nexHora : `${nexHora > 12 ? nexHora - 12 : nexHora}:00 `,
                            ampm: ampm,
                            ampmNexHora: ampmNexHora,
                            estado: 'disponible' // Estado inicial de cada horario
                        });
                }                
            }
            return lista;
        })
        }, [horaApertura, horaCierre]);



        const totalReserva = useMemo(() => {
            // Multiplicamos el coste por hora por el número de horas seleccionadas
            const numeroDeHoras = listaHorariosSeleccionados.length;

            return (costeReserva * numeroDeHoras).toFixed(2);
        }, [costeReserva, listaHorariosSeleccionados]);

        const isBotonReservarDisabled = useMemo(() => {
            // El botón se deshabilita si no hay horarios seleccionados.
            // Si la reserva tiene coste, también se deshabilita si el total es 0.
            return listaHorariosSeleccionados.length === 0 || (costeReserva > 0 && totalReserva <= 0);
        }, [listaHorariosSeleccionados, costeReserva, totalReserva]);

    // Obtener la fecha actual
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth(); 
    const currentYear = today.getFullYear();

    // Estados para el mes y año seleccionados
    const [selectedMonth, setSelectedMonth] = useState(currentMonth); 
    const [selectedYear, setSelectedYear] = useState(currentYear);   
    const [selectedDate, setSelectedDate] = useState(currentDay); 

    // Dummy data for calendar days (adjust for actual month logic if needed)
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

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



    const handleDateClick = (date) => {
        const selectedDateTime = new Date(selectedYear, selectedMonth, date);
        if (selectedDateTime < today.setHours(0, 0, 0, 0)) { // Comparar solo las fechas, ignorar la hora
            // No hacer nada si la fecha ya pasó
            return;
        }
        setSelectedDate(date);

        setListaHorariosSeleccionados([]); // Limpiar la selección de horarios al cambiar la fecha
        
    }

    const handleChangeMonth = (event) => {
        const newMonth = parseInt(event.target.value, 10);
        setSelectedMonth(newMonth);
        setSelectedDate(1); // Reiniciar la fecha seleccionada al primer día del nuevo mes
        setListaHorariosSeleccionados([]); // Limpiar la selección de horarios al cambiar el mes
    };

    const handleChangeYear = (event) => {
        const newYear = parseInt(event.target.value, 10);
        setSelectedYear(newYear);
        setSelectedMonth(0); // Reiniciar el mes seleccionado al primer mes del nuevo año
        setSelectedDate(1); // Reiniciar la fecha seleccionada al primer día del nuevo
        setListaHorariosSeleccionados([]); // Limpiar la selección de horarios al cambiar el año
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


    // Seleccionar la Unidad

    const handleUnidadSeleccionada = (unidad) => {
        if (unidadSeleccionada != unidad.id_servicio_reservable_empresa) {
            // Si no, la seleccionamos
            setUnidadSeleccionada(unidad.id_servicio_reservable_empresa);
            setCosteReserva(unidad.costo_servicio);
            setListaHorariosSeleccionados([]); // Limpiar la selección de horarios al cambiar de unidad

            setHoraApertura(unidad.hora_apertura_servicio)
            setHoraCierre(unidad.hora_cierre_servicio);

            setListaHorariosYaReservadosPorEmpresa((listaHorariosYaReservados || []).filter(reserva => reserva.id_servicio_reservable_empresa === unidad.id_servicio_reservable_empresa));
        }
    }


    

        
    const handleSelectHour = (hora) => {
        setListaHorariosSeleccionados(prev => {
            // Verifica si la hora ya está seleccionada
            if (prev.includes(hora)) {
                // Si ya está seleccionada, la eliminamos
                return prev.filter(h => h !== hora);
            } else {
                // Si no está seleccionada, la añadimos
                return [...prev, hora];
            }
        });
    }

    useEffect(() => {

        const actualizarHorarios = async () => {
            const reservacionesParaLaFecha = await reservaServicioService.getHorasReservadasPorServicioPorFecha(
                id, 
                new Date(selectedYear, selectedMonth, selectedDate).toISOString().slice(0, 10), 
                user.id_club
            );

            const empresaSeleccionada = empresasReservadoras.find(e => e.id_servicio_reservable_empresa === unidadSeleccionada);
            const cantidadTrabajadores = empresaSeleccionada?.cantidad_trabajadores || 1;

            // console.log('Reservaciones para la fecha:', reservacionesParaLaFecha);
            // console.log('Cantidad de trabajadores:', cantidadTrabajadores);
            // console.log('Empresa seleccionada:', empresaSeleccionada);

            setListaHorarios(currentHorarios =>
                currentHorarios.map(horario => {
                    const reservasEnEstaHora = reservacionesParaLaFecha.filter(
                        reserva =>
                            reserva.hora_reserva.slice(0, 2) === horario.hora24 &&
                            reserva.id_servicio_reservable_empresa === unidadSeleccionada
                    ).length;

                    const isReserved = reservasEnEstaHora >= cantidadTrabajadores;

                    return {
                        ...horario,
                        estado: isReserved ? 'reservado' : 'disponible'
                    };
                })
            )
        }

        actualizarHorarios();
        
    },[selectedDate, selectedMonth, selectedYear, listaHorariosYaReservados, listaHorariosYaReservadosPorEmpresa, unidadSeleccionada] )


    const handleConfirmarReserva = async () => {
        setLoading(true);
        try {
            const fechaReserva = new Date(selectedYear, selectedMonth, selectedDate);
            const horariosReserva = listaHorariosSeleccionados.map(hora => {
                const horaInt = parseInt(hora, 10);
                return `${horaInt.toString().padStart(2, '0')}:00`;
            });

            const datosCompletosReserva = {
                id_usuario: user.id_usuario,
                reservaServicioData: {
                    id_servicio_reservable : servicio.id_servicio_reservable,
                    id_servicio_reservable_empresa: unidadSeleccionada,
                    fecha_reservacion: fechaReserva.toISOString(),
                    nota: notaReserva,
                    coste_total: totalReserva,
                    id_socio: user?.id_socio || null, // Asegúrate de que el usuario esté autenticado
                },
                transaccionData: {
                    id_billetera: user.id_billetera, 
                    id_tipo_transaccion: TIPOS_TRANSACCION.SERVICIO, 
                    monto: totalReserva
                },
                listaHoras: horariosReserva
            }
            
            //console.log('Datos de reserva:', datosCompletosReserva);



            const response = await reservaServicioService.createReservaServicio(datosCompletosReserva);
            console.log('Respuesta de la reserva:', response);

            if(response){
                actualizarSaldoBilletera();

                setShowExitosoModal(true); // Mostrar modal de éxito
                setShowServicioReservaModal(false); // Cerrar el modal de reserva
            }

        }catch (error) {
            console.error('Error al confirmar la reserva:', error);
        }
        finally {
            setLoading(false);
            // Limpiar los estados después de la reserva
            setListaHorariosSeleccionados([]);
            setNotaReserva('');

            // Actualizar la lista de horarios reservados
            const fechaReserva = new Date(selectedYear, selectedMonth, selectedDate).toISOString().slice(0, 10);
            
            const reservacionesServicioFecha = await reservaServicioService.getHorasReservadasPorServicioPorFecha(id, fechaReserva, user.id_club);
            setListaHorariosYasReservados((reservacionesServicioFecha || []).map(reserva => {
                return {
                    id_servicio_reservable_empresa: reserva.id_servicio_reservable_empresa,
                    horaReserva: reserva.hora_reserva.slice(0, 2), // Extrae solo la hora en formato HH:mm
                    fecha: fechaReserva
                };
            }));



            setTimeout(() => {
                setShowExitosoModal(false); // Cerrar modal de éxito después de 2
            }, 2000);

        }
    }

    const handleCloseModal = () => {

        setShowServicioReservaModal(false); // Cerrar el modal de reserva
    }


    return (
        <React.Fragment>
            <ExitosoModal
                visible={showExitosoModal} 
                mensaje='¡Reserva realizada con éxito!'
            ></ExitosoModal>
            <ServicioReservaModal 
                visible={showServicioReservaModal} 
                onClose={() => handleCloseModal()} 
                onConfirm={() => handleConfirmarReserva()}
                servicio={servicio}
                empresaSeleccionada={empresasReservadoras.find(e => e.id_servicio_reservable_empresa === unidadSeleccionada)}
                fecha={new Date(selectedYear, selectedMonth, selectedDate)}
                horarios={listaHorariosSeleccionados}
                costeTotal={totalReserva}
                nota={notaReserva}
                setNota={setNotaReserva}


                ></ServicioReservaModal>
            <LoadingModal visible={loading} />

            <div className="servicio-header">

                <div className='boton-volver-container'>
                    <ButtonVolver to={backLocation} className="boton-volver-white" />
                </div>

                <h1>{servicio ? servicio.nombre_servicio_reservable : ''}</h1>
                <p className="espacio-detalle-description">{servicio?.descripcion}</p>
                {
                    costeReserva > 0 && (<p className='detalle-costo-hora'>{costeReserva}$/hora</p>)
                }
                
            </div>

            <div className="servicio-container">
                    <main className="booking-main-content">

                        <SelectorDeEmpresaReservadora
                            empresasReservadoras={empresasReservadoras}
                            unidadSeleccionada={unidadSeleccionada}
                            handleUnidadSeleccionada={handleUnidadSeleccionada}
                        />

                        <section className="date-section">
                            <div className='date-selectors-container'>
                                <div className="date-selectors">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => handleChangeMonth(e)}
                                    >
                                        {monthOptions.map(month => (
                                            <option key={month.value} value={month.value}>{month.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => handleChangeYear(e)}
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
                            <h2>Horario</h2>
                            <div className='time-range'>
                                <span className="time-value">{formatearHora(horaApertura)}</span>
                                <span className="time-separator">-</span>
                                <span className="time-value">{formatearHora(horaCierre)}</span>
                            </div>

                            <SelectorHorario 
                                listaHorarios={listaHorarios} 
                                listaHorariosSeleccionados={listaHorariosSeleccionados} 
                                handleSelectHour={handleSelectHour} 
                            />

                        </section>
                    </main>

                    <footer className="booking-footer">
                        
                        <button className={`proceed-button`} 
                            disabled={ isBotonReservarDisabled } 
                            onClick={() => { setShowServicioReservaModal(true) }}>
                            {totalReserva > 0 ? `Reservar por $${totalReserva}` : 'Reservar'}
                        </button>
                    </footer>

            </div>
        </React.Fragment>
    );
}

const SelectorDeEmpresaReservadora = ({ empresasReservadoras, unidadSeleccionada, handleUnidadSeleccionada }) => {
    return (
        <div className='reserva-unidades-container'>
                            {empresasReservadoras.length > 0 && (
                                <div className="unidades-list">
                                    <h2>Seleccionables</h2>
                                    {empresasReservadoras.map(unidad => (
                                        <div 
                                            key={unidad.id_servicio_reservable_empresa} 
                                            onClick={() => handleUnidadSeleccionada(unidad)}
                                            className={`unidad-item ${unidadSeleccionada == unidad.id_servicio_reservable_empresa ? 'active' : ''}`}>
                                            <div className="unidad-info">
                                                <h3>{unidad.nombre_comercio}</h3>
                                                <p className="unidad-capacity">Capacidad: {unidad.capacidad}</p>
                                                {unidad.costo_servicio > 0 ? <p>{unidad.costo_servicio}$</p> : <p>Sin Coste</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) }
                        </div>
    )
}

const SelectorHorario = ({listaHorarios, listaHorariosSeleccionados, handleSelectHour}) =>{
    return (
        <div className='time-selectors-container'>
                                <div className="time-selectors">
                                    {
                                        listaHorarios.map(horario => {
                                            return (
                                                <div 
                                                    className={`time-selectors-item ${horario.estado} ${listaHorariosSeleccionados.includes(horario.hora24) ? 'active' : ''}`}
                                                    key={horario.hora24}
                                                    onClick={() => {
                                                        horario.estado == 'disponible' ? handleSelectHour(horario.hora24) : null;
                                                    }}
                                                >
                                                    <p>
                                                        {horario.ampm === horario.ampmNexHora
                                                            ? `${horario.hora} - ${horario.nexHora} ${horario.ampm}`
                                                            : `${horario.hora}${horario.ampm} - ${horario.nexHora}${horario.ampmNexHora}`}
                                                    </p>
                                                </div>
                                            )
                                        })
                                    }
                                    
                                </div>
                            </div>
    )
}