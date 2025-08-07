const API_HOST = import.meta.env.VITE_API_HOST;


const getComercios = async (id_club) => {
  const response = await fetch(`${API_HOST}/api/comercios/${id_club}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los comercios');
  return response.json();
}

const getComerciosActivos = async (id_club, id_tipo_comercio) => {
  const response = await fetch(`${API_HOST}/api/comercios/${id_club}/activos/${id_tipo_comercio}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
    if (!response.ok) throw new Error('Error al obtener los comercios activos');
    return response.json();
}

const getComercioById = async (id) => {
  const response = await fetch(`${API_HOST}/api/comercios/individual/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener el comercio por ID');
  return response.json();
}

const getCategoriasComercioActivos = async (id_club, id_tipo_comercio) => {
    const response = await fetch(`${API_HOST}/api/comercios/${id_club}/categorias-activos/${id_tipo_comercio}`,{
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