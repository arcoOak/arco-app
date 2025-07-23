const API_HOST = import.meta.env.VITE_API_HOST ;

const enviarInvitacionQr = async (id_usuario, id_rol, dataInvitado) => {
    const response = await fetch(`${API_HOST}/api/invitaciones/enviar-invitacion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_rol, dataInvitado })
    });
    if (!response.ok) throw new Error('Error al enviar la invitación QR');
    return response.json();
}

const enviarInvitacionQrFamiliares = async (id_usuario, id_rol, listaFamiliares) => {
    const promises = listaFamiliares.map(familiar => {
        return enviarInvitacionQr(id_usuario, id_rol, familiar);
    });

    try {
        const results = await Promise.all(promises);
        return results;
    } catch (error) {
        console.error('Error al enviar la invitación QR a familiares:', error);
        throw error;
    }
}

export default {
    enviarInvitacionQr,
    enviarInvitacionQrFamiliares
};