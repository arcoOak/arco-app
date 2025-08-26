const API_HOST = import.meta.env.VITE_API_HOST;

const getCompraById = async (id) => {
    try {
        const response = await fetch(`${API_HOST}/api/compras/${id}`);
        if (!response.ok) throw new Error('Error al obtener la compra');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getComprasByUsuarioMes = async (id_socio, mes, anho) => {
    try {
        const response = await fetch(`${API_HOST}/api/compras/mensual/${id_socio}/${mes}/${anho}`);
        if (!response.ok) throw new Error('Error al obtener las compras del usuario por mes');
        if( response.status === 404) {
            return []; // Retornar un array vacío si no hay compras
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error; 
    }
};

const crearCompra = async (compraData) => {
    try {
        const response = await fetch(`${API_HOST}/api/compras`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compraData)
        });
        if (!response.ok) throw new Error('Error al crear la compra');
        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export default {
    getCompraById,
    getComprasByUsuarioMes,
    crearCompra
};
