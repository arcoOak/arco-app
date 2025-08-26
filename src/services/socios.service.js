const API_HOST = import.meta.env.VITE_API_HOST;

const getAllSocios = async () => {
    try {
        const response = await fetch(`${API_HOST}/socios`);
        if (!response.ok) {
            throw new Error('Error al obtener los socios');
        }
        return await response.json();
    } catch (error) {
        console.error('Error en getAllSocios:', error);
        throw error;
    }
};

export default {
    getAllSocios,
};