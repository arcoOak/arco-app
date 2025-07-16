const API_HOST = import.meta.env.VITE_API_HOST;

const getReservaById = async (id_reserva) => {
    const response = await fetch(`${API_HOST}/api/reservas/${id_reserva}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las reservas');
    return response.json();
}

const getReservasByEspacioUnidad = async (id_espacio) => {
    const response = await fetch(`${API_HOST}/api/reservas/unidad/${id_espacio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    return response.json();
}
const getReservasPorUsuario = async (id_usuario) => {
    const response = await fetch(`${API_HOST}/api/reservas/usuario/${id_usuario}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
}

const getReservasByEspacioUnidadMes = async (id_espacio, mes) => {
    const response = await fetch(`${API_HOST}/api/reservas/mensual/unidad/${id_espacio}/${mes}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
}

const getReservaByUsuarioMes = async (id_usuario, mes) => {
    const response = await fetch(`${API_HOST}/api/reservas/mensual/usuario/${id_usuario}/${mes}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
}

const getHorasReservadasPorUnidadFecha = async (id_unidad, fecha) => {
    const response = await fetch(`${API_HOST}/api/reservas/horas/unidad/${id_unidad}/${fecha}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las horas reservadas por unidad y fecha');
    return response.json();
}

const getHorasReservadasPorReserva = async (id_reserva) => {
    const response = await fetch(`${API_HOST}/api/reservas/horas/reserva/${id_reserva}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las horas reservadas por reserva');
    return response.json();
}

const getInvitadosPorReserva = async (id_reserva) => {
    const response = await fetch(`${API_HOST}/api/reservas/invitados/${id_reserva}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener los invitados por reserva');
    return response.json();
}

const createReserva = async (datosCompletosReserva) => {
    const response = await fetch(`${API_HOST}/api/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletosReserva)
    });
    if (!response.ok) throw new Error('Error al crear la reserva');
    return response.json();
}

export default{
    getReservaById,
    getReservasByEspacioUnidad,
    getReservasPorUsuario,
    getReservasByEspacioUnidadMes,
    getReservaByUsuarioMes,
    getHorasReservadasPorUnidadFecha,
    getHorasReservadasPorReserva,
    getInvitadosPorReserva,
    createReserva
}