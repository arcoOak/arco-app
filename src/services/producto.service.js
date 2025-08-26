const API_HOST = import.meta.env.VITE_API_HOST;


const getProductos = async (id_club) => {
  const response = await fetch(`${API_HOST}/api/productos/${id_club}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los productos');
  return response.json();
}

const getProductosIndividuales = async (id_club) => {
  const response = await fetch(`${API_HOST}/api/productos/individuales/${id_club}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
    if (!response.ok) throw new Error('Error al obtener los productos individuales');
    return response.json();
}

const getProductoById = async (id) => {
  const response = await fetch(`${API_HOST}/api/productos/individual/${id}`, {
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
  if (!response.ok) return [];
  return response.json();
}

const getCategoriasDeProductosPorComercio = async (id_comercio) => {
  const response = await fetch(`${API_HOST}/api/productos/categorias-comercio/${id_comercio}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) return [];
  return response.json();
}

const verificarDisponibilidad = async (productos) => {
  const response = await fetch(`${API_HOST}/api/productos/verificar-disponibilidad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productos)
  });
  if (!response.ok) throw new Error('Error al verificar disponibilidad');
  return response.json();
}

export default {
    getProductos,
    getProductosIndividuales,
    getProductoById,
    getProductosPorComercio,
    getCategoriasDeProductosPorComercio,
    verificarDisponibilidad
}