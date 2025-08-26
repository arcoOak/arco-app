const API_HOST = import.meta.env.VITE_API_HOST;

const getClimaSemanal = async (id_club) => {
    const response = await fetch(`${API_HOST}/api/clima/${id_club}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener el clima semanal');
    return response.json();
};

export default {
    getClimaSemanal,
};