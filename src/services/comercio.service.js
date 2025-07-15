const API_HOST = import.meta.env.VITE_API_HOST;


const getComercios = async () => {
  const response = await fetch(`${API_HOST}/api/comercios`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los comercios');
  return response.json();
}

const getComerciosActivos = async () => {
  const response = await fetch(`${API_HOST}/api/comercios/activos`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
    if (!response.ok) throw new Error('Error al obtener los comercios activos');
    return response.json();
}

const getComercioById = async (id) => {
  const response = await fetch(`${API_HOST}/api/comercios/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener el comercio por ID');
  return response.json();
}

const getCategoriasComercioActivos = async () => {
    const response = await fetch(`${API_HOST}/api/comercios/categorias-activos`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los categorías de comercio activos');
  return response.json();
}



export default {
    getComercios,
    getComerciosActivos,
    getComercioById,
    getCategoriasComercioActivos
}