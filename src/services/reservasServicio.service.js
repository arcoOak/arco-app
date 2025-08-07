const API_HOST = import.meta.env.VITE_API_HOST;

const getReservaServicioById = async (id_reserva_servicio) => {
    const response = await fetch(`${API_HOST}/api/reservas-servicios/${id_reserva_servicio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener la reserva de servicio');
    return response.json();
}

const getReservasServicioPorServicio = async (id_servicio, id_club) => {
    const response = await fetch(`${API_HOST}/api/reservas-servicios/servicio/${id_club}/${id_servicio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las reservas de servicio');
    return response.json();
}

const getReservasServicioPorServicioYMes = async (id_servicio, id_club, anho, mes) => {
    const response = await fetch(`${API_HOST}/api/reservas-servicios/servicio/mensual/${id_club}/${anho}/${mes}/${id_servicio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las reservas de servicio por mes');
    return response.json();
}

const getReservasServicioPorSocio = async (id_socio, id_club) => {
    const response = await fetch(`${API_HOST}/api/reservas-servicios/socio/${id_club}/${id_socio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las reservas de servicio por usuario');
    return response.json();
}

const getReservasServicioPorSocioYMes = async (id_socio, id_club, anho, mes) => {
    const response = await fetch(`${API_HOST}/api/reservas-servicios/socio/${id_club}/mensual/${anho}/${mes}/${id_socio}`, {
        method: 'GET', 
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las reservas de servicio por usuario y mes');
    return response.json();
}

const getHorasReservadasPorServicioPorFecha = async ( id_servicio, fecha, id_club) => {

    const response = await fetch(`${API_HOST}/api/reservas-servicios/horas/${id_club}/${id_servicio}/${fecha}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las horas reservadas por servicio y fecha');
    return response.json();
}

const getHorasReservadasPorReservaServicios = async (id_reserva_servicio) => {
    const response = await fetch(`${API_HOST}/api/reservas-servicios/horas/${id_reserva_servicio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las horas reservadas por reserva de servicio');
    return response.json();
}

const createReservaServicio = async (data) => {
    const response = await fetch(`${API_HOST}/api/reservas-servicios/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear la reserva de servicio');
    return response.json();
}

export default {
    getReservaServicioById,
    getReservasServicioPorServicio,
    getReservasServicioPorServicioYMes,
    getReservasServicioPorSocio,
    getReservasServicioPorSocioYMes,
    getHorasReservadasPorServicioPorFecha,
    getHorasReservadasPorReservaServicios,
    createReservaServicio

}