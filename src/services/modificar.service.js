const API_HOST = import.meta.env.VITE_API_HOST;

const modificarSocioData = async (socioNuevaData) => {
    const response = await fetch(`${API_HOST}/api/socios/${socioNuevaData.id_socio}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socioNuevaData),
    });
    if (!response.ok) throw new Error('Error al modificar los datos del socio');
    return await response.json();
}


export default {
    modificarSocioData
};
