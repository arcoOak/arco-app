const API_HOST = import.meta.env.VITE_API_HOST;

const getDatosClub = async (id_club) => {
    const response = await fetch(`${API_HOST}/api/club/${id_club}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener los datos del club');
    return response.json();
}

export default {
    getDatosClub
}