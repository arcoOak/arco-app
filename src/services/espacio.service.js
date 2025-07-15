const API_HOST = import.meta.env.VITE_API_HOST;

const getAllEspaciosReservables = async () => {
    const response = await fetch(`${API_HOST}/api/espacios`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener los espacios reservables');
    return response.json();
}

const getEspacioByCategoria = async (id_categoria_espacio) => {
    const response = await fetch(`${API_HOST}/api/espacios/categoria/${id_categoria_espacio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener los espacios por categoría');
    return response.json();
}

const getEspacioById = async (id_espacio) => {
    const response = await fetch(`${API_HOST}/api/espacios/${id_espacio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener el espacio por ID');
    return response.json();
}

const getEspacioUnidadesById = async (id_espacio) => {
    const response = await fetch(`${API_HOST}/api/espacios/unidades/${id_espacio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las unidades del espacio');
    return response.json();
}

const getCategoriasEspacioDisponible = async () => {
    const response = await fetch(`${API_HOST}/api/espacios/categorias-disponibles`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las categorías de espacios disponibles');
    return response.json();
}

export default {
    getAllEspaciosReservables,
    getEspacioByCategoria,
    getEspacioById,
    getEspacioUnidadesById,
    getCategoriasEspacioDisponible
}