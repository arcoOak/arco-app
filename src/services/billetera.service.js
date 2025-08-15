const API_HOST = import.meta.env.VITE_API_HOST;

const getBilletera = async (id_socio) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_socio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener la billetera');
    return response.json();
}

const getUltimasTransaccionesBilletera = async (id_socio) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_socio}/ultimas-transacciones`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las últimas transacciones');
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

const getPagosPendientes = async (id_socio) => {
    const response = await fetch(`${API_HOST}/api/billetera/${id_socio}/pagos-pendientes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener pagos pendientes');
    return response.json();
}

const getTransaccionPorId = async (id_billetera_transaccion) => {
    const response = await fetch(`${API_HOST}/api/billetera/transaccion/${id_billetera_transaccion}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener la transacción por ID');
    return response.json();
}


const crearTransaccionBilletera = async (transaccionData) => {
    const response = await fetch(`${API_HOST}/api/billetera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaccionData)
    });
    if (!response.ok) throw new Error('Error al crear la transacción');
    return response.json();
}

const pagarTransaccion = async (transaccionData) => {
    const response = await fetch(`${API_HOST}/api/billetera/pagar/${transaccionData.id_pago_asociado}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaccionData)
    });
    if (!response.ok) throw new Error('Error al editar la transacción');
    return response.json();
}

export default {
    getBilletera,
    getUltimasTransaccionesBilletera,
    getTransaccionesBilleteraPorMes,
    getTransaccionesBilleteraCompletaPorMes,
    getPagosPendientes,
    getTransaccionPorId,
    crearTransaccionBilletera,
    pagarTransaccion
}