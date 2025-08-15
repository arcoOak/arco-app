const API_HOST = import.meta.env.VITE_API_HOST;

const crearReservaTransaccion = async (datosReserva) => {
  try {
    const response = await fetch(`${API_HOST}/api/transacciones/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosReserva),
    });

    if (!response.ok) {
      throw new Error('Error al crear la reserva');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};



const crearReservaServicioTransaccion = async (datosReserva) => {
  try {
    const response = await fetch(`${API_HOST}/api/transacciones/servicios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosReserva),
    });

    if (!response.ok) {
      throw new Error('Error al crear la reserva');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};




export default {
  crearReservaTransaccion,
  crearReservaServicioTransaccion,
};