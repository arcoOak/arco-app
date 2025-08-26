const API_HOST = import.meta.env.VITE_API_HOST;

const getTransaccionPorId = (id_billetera_transaccion) =>{
    return fetch(`${API_HOST}/api/transacciones/${id_billetera_transaccion}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la transacción');
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

const getTransaccionesSocioCompletoPorMes = (id_socio, mes, anho) =>{
    
    return fetch(`${API_HOST}/api/transacciones/mes/completo/${id_socio}/${mes}/${anho}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las transacciones completas');
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

const getTransaccionesPendientes = (id_socio) =>{
    return fetch(`${API_HOST}/api/transacciones/pendientes/${id_socio}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las transacciones pendientes');
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

const getUltimasTransaccionesSocio = (id_socio) =>{
    return fetch(`${API_HOST}/api/transacciones/ultimas/${id_socio}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las últimas transacciones');
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

const pagarTransaccion = (datosPago) =>{
    return fetch(`${API_HOST}/api/transacciones/pagar/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosPago)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al pagar la transacción');
        }
        return response.json();
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}


export default {
    getTransaccionPorId,
    getTransaccionesSocioCompletoPorMes,
    getTransaccionesPendientes,
    getUltimasTransaccionesSocio,
    pagarTransaccion
};