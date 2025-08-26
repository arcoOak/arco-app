const API_HOST = import.meta.env.VITE_API_HOST;

const getGeneros = async () => {
  const response = await fetch(`${API_HOST}/api/data/generos`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los géneros');
  return response.json();
};

const getParentescos = async () => {
  const response = await fetch(`${API_HOST}/api/data/parentesco/genero`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los parentescos');
  return response.json();
};



const getCategoriasComercio = async () => {
    const response = await fetch(`${API_HOST}/api/data/categorias-comercio`,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al obtener las categorías de comercio');
    return response.json();
}

const getMetodosPago = async () => {
  const response = await fetch(`${API_HOST}/api/data/metodos-pago`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los métodos de pago');
  return response.json();
};

export default { getGeneros, getParentescos, getCategoriasComercio, getMetodosPago };

