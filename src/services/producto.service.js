const API_HOST = import.meta.env.VITE_API_HOST;


const getProductos = async () => {
  const response = await fetch(`${API_HOST}/api/productos`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los productos');
  return response.json();
}

const getProductosIndividuales = async () => {
  const response = await fetch(`${API_HOST}/api/productos/individuales`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
    if (!response.ok) throw new Error('Error al obtener los productos individuales');
    return response.json();
}

const getProductoById = async (id) => {
  const response = await fetch(`${API_HOST}/api/productos/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener el producto por ID');
  return response.json();
}

const getProductosPorComercio = async (id_comercio) => {
  const response = await fetch(`${API_HOST}/api/productos/comercio/${id_comercio}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los productos por comercio');
  return response.json();
}

export default {
    getProductos,
    getProductosIndividuales,
    getProductoById,
    getProductosPorComercio
}