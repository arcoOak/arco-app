const API_HOST = import.meta.env.VITE_API_HOST;


const getBeneficiariosBySocioId = async (socioId) => {
  const response = await fetch(`${API_HOST}/api/familiares/buscar/${socioId}`,{
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error al obtener los beneficiarios');
  return response.json();
};

export default {
  getBeneficiariosBySocioId
};