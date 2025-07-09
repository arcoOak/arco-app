const API_HOST = import.meta.env.VITE_API_HOST;


const obtenerTokenQrPorUsuario = async (id_usuario, id_rol) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/${id_usuario}/${id_rol}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) return { token: null };
    return response.json();
    
}

const obtenerTokenQrPorUsuarioFamiliar = async (id_usuario, id_rol, id_familiar) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/familiar/${id_usuario}/${id_rol}/${id_familiar}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error('Error al obtener el token QR familiar');
    return response.json();

}

const crearTokenQr = async (id_usuario, id_rol) => {
    const response = await fetch(`${API_HOST}/api/qrtoken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_rol })
    });
    if (!response.ok) throw new Error('Error al crear el token QR');
    return response.json();
}

const crearTokenQrFamiliar = async (id_usuario, id_rol, id_familiar) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/familiar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_rol, id_familiar })
    });
    if (!response.ok) throw new Error('Error al crear el token QR familiar');
    return response.json();
}

const actualizarTokenQr = async (id_usuario, id_rol) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_rol })
    });
    if (!response.ok) throw new Error('Error al actualizar el token QR');
    return response.json();
}

const actualizarTokenQrFamiliar = async (id_usuario, id_rol, id_familiar) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/familiar/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_rol, id_familiar })
    });
    if (!response.ok) throw new Error('Error al actualizar el token QR familiar');
    return response.json();
}

const validarTokenQr = async (token) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/validar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });
    if (!response.ok) throw new Error('Error al validar el token QR');
    return response.json();
}

const generarTokenQr = async (id_usuario, id_rol, signal) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_rol }),
        signal // Para cancelar la petición
    });
    if (!response.ok) throw new Error('Error al generar el token QR');
    return response.json();
}

const generarTokenQrFamiliar = async (id_usuario, id_rol, id_familiar) => {
    const response = await fetch(`${API_HOST}/api/qrtoken/familiar/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario, id_rol, id_familiar })
    });
    if (!response.ok) throw new Error('Error al generar el token QR familiar');
    return response.json();
}

export default {
    obtenerTokenQrPorUsuario,
    obtenerTokenQrPorUsuarioFamiliar,
    crearTokenQr,
    crearTokenQrFamiliar,
    actualizarTokenQr,
    actualizarTokenQrFamiliar,
    validarTokenQr,
    generarTokenQr,
    generarTokenQrFamiliar
};