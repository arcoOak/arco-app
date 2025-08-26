const API_HOST = import.meta.env.VITE_API_HOST;

const crearMensualidad = async (datosMensualidad) => {
  try {
    const response = await fetch(`${API_HOST}/api/mensualidades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosMensualidad),
    });

    if (!response.ok) {
      throw new Error('Error al crear el pago de mensualidad');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const pagarMensualidad = async (datosPago) => {
  try {
    const response = await fetch(`${API_HOST}/api/mensualidades/pagar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosPago),
    });

    if (!response.ok) {
      throw new Error('Error al pagar la mensualidad');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  crearMensualidad,
  pagarMensualidad
};