const API_HOST = import.meta.env.VITE_API_HOST;

const modificarSocioData = async (socioNuevaData, id_socio) => {
    const response = await fetch(`${API_HOST}/api/socios/${id_socio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socioNuevaData),
    });
    if (!response.ok) throw new Error('Error al modificar los datos del socio');
    return await response.json();
}

const modificarContrasenaUsuario = async (id_usuario, contrasena, contrasenaNueva) =>{
    const response = await fetch(`${API_HOST}/api/usuarios/contrasena/${id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contrasena, contrasenaNueva }),
    });
    if (!response.ok) throw new Error('Error al modificar la contraseña del usuario');
    return await response.json();
}


export default {
    modificarSocioData,
    modificarContrasenaUsuario
};
