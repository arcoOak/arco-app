const API_HOST = import.meta.env.VITE_API_HOST;

const getBilletera = async (id_socio) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_socio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener la billetera');
    return response.json();
}

const getTransaccionesBilleteraPorMes = async (id_socio, mes) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_socio}/transacciones/${mes}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener transacciones por mes');
    return response.json(); 
}

const getTransaccionesBilleteraCompletaPorMes = async (id_socio, mes) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_socio}/transacciones-completas/${mes}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener transacciones completas por mes');
    return response.json();
}

export default {
    getBilletera,
    getTransaccionesBilleteraPorMes,
    getTransaccionesBilleteraCompletaPorMes
}