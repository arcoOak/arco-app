const API_HOST = import.meta.env.VITE_API_HOST;

const getCantidadInvitadosPorUsuarioMes = async (id_usuario, mes) => {
    const response = await fetch(`${API_HOST}/api/invitados/cantidad/${id_usuario}/${mes}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener la cantidad de invitados por usuario y mes');
    return response.json();
}
const removeInvitado = async (id_reserva, id_invitado) => {
    const response = await fetch(`${API_HOST}/api/invitados/${id_reserva}/${id_invitado}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al eliminar el invitado');
    return response.json();
}

const createInvitado = async (invitado) => {    
    const response = await fetch(`${API_HOST}/api/invitados/crear/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitadoData: invitado })
    });
    if (!response.ok) throw new Error('Error al crear el invitado');
    return response.json();
}

const createInvitadoParaReserva = async (id_reserva, listaInvitados) => {
    const response = await fetch(`${API_HOST}/api/invitados/crear/${id_reserva}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_reserva, listaInvitados })
    });
    if (!response.ok) throw new Error('Error al crear los invitados para la reserva');
    return response.json();
}

export default {
    getCantidadInvitadosPorUsuarioMes,
    removeInvitado,
    createInvitado,
    createInvitadoParaReserva
};

