const API_HOST = import.meta.env.VITE_API_HOST;

const getTodosServicios = async (id_club) => {
    const response = await fetch(`${API_HOST}/api/servicios/todos/${id_club}`);
    if (!response.ok) {
        return []
    }
    return response.json();
}

const getHomeServicios = async (id_club) => {
    const response = await fetch(`${API_HOST}/api/servicios/home/${id_club}`);
    if (!response.ok) {
        return []
    }
    return response.json();
}

const getTodasOfertasServiciosComercio = async (id_club) => {
    const response = await fetch(`${API_HOST}/api/servicios/ofertas/${id_club}`);
    if (!response.ok) {
        return []
    }
    return response.json();
}

const getCategoriasServiciosActivos = async (id_club) => {
    const response = await fetch(`${API_HOST}/api/servicios/categorias/${id_club}`);
    if (!response.ok) {
        return []
    }
    return response.json();
}

const getServicioPorId = async (id_servicio) => {
    const response = await fetch(`${API_HOST}/api/servicios/servicio/${id_servicio}`);
    if (!response.ok) {
        return null;
    }
    return response.json();
}

const getEmpresasReservadorasPorServicio = async (id_servicio) => {
    const response = await fetch(`${API_HOST}/api/servicios/empresas/${id_servicio}`);
    if (!response.ok) {
        return [];
    }
    return response.json();
}

const getServiciosPorEmpresaReservadora = async (id_empresa) => {
    const response = await fetch(`${API_HOST}/api/servicios/servicio/empresa/${id_empresa}`);
    if (!response.ok) {
        return [];
    }
    return response.json();
}

const getCategoriasServiciosActivosPorEmpresaReservadora = async (id_empresa) => {
    const response = await fetch(`${API_HOST}/api/servicios/categorias/empresa/${id_empresa}`);
    if (!response.ok) {
        return [];
    }
    return response.json();
}

export default {
    getTodosServicios,
    getHomeServicios,
    getTodasOfertasServiciosComercio,
    getCategoriasServiciosActivos,
    getServicioPorId,
    getEmpresasReservadorasPorServicio,
    getServiciosPorEmpresaReservadora,
    getCategoriasServiciosActivosPorEmpresaReservadora
}