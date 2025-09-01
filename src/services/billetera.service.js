const API_HOST = import.meta.env.VITE_API_HOST;

const getBilleteraBySocio = async (id_socio) => {
    const response = await fetch(`${API_HOST}/api/billetera/socio/${id_socio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener la billetera');
    return response.json();
}

const getBilleteraById = async (id_billetera) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_billetera}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener la billetera por ID');
    return response.json();
}

const getSaldoBilletera = async (id_billetera) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_billetera}/saldo`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener el saldo de la billetera');
    return response.json();
}

const recargarSaldo = async (recargaData) => {
    const response = await fetch(`${API_HOST}/api/billetera/recargar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recargaData)
    });
    if (!response.ok) throw new Error('Error al recargar saldo');
    return response.json();
}

const validarRecarga = async (validacionData) => {
    const response = await fetch(`${API_HOST}/api/billetera/validar-recarga`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validacionData)
    });
    if (!response.ok) throw new Error('Error al validar recarga');
    return response.json();
}

export default {
    getBilleteraById,
    getBilleteraBySocio,
    getSaldoBilletera,
    recargarSaldo,
    validarRecarga
}