import React, { useState, useEffect } from 'react';
import climaService from '../services/clima.service'; // Importa el servicio de clima

import './ClimaHome.css'; // Asegúrate de tener un archivo CSS para estilos

import { useAuth } from '../context/AuthContext';

// Helper para obtener un nombre de día simple y legible
const getDayName = (dateString, index) => {
    const date = new Date(dateString);
    // Asegurarse de que la fecha se interpreta en UTC para evitar problemas de zona horaria
    const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('es-ES', options).format(utcDate).slice(0, 3).toUpperCase(); // Retorna el nombre del día abreviado y el índice
};

// Helper para obtener un ícono basado en la precipitación y temperatura
const getWeatherIcon = (precipitacion, temperatura) => {
    if (precipitacion > 60) return '🌧️'; // Lluvia fuerte
    if (precipitacion > 30) return '🌦️'; // Lluvia ligera
    if (temperatura < 15) return '☁️'; // Nublado/Fresco
    return '☀️'; // Soleado
};

const ClimaSemanal = () => {
    const [climaPorDia, setClimaPorDia] = useState([]);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchClima = async () => {
            try {
                const data = await climaService.getClimaSemanal(user.id_club);

                // Agrupar datos por día
                const grouped = data.reduce((acc, item) => {
                    const date = item.fecha.split('T')[0];
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(item);
                    return acc;
                }, {});

                // Ordenar los días y las horas dentro de cada día
                const sortedDays = Object.keys(grouped).sort();
                const processedData = sortedDays.map(day => {
                    return grouped[day].sort((a, b) => a.hora.localeCompare(b.hora));
                });

                setClimaPorDia(processedData.slice(0, 7)); // Limitar a 7 días
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener el clima:", err);
                setError('No se pudo cargar la información del clima.');
                setLoading(false);
            }
        };

        fetchClima();
    }, []);

    if (loading) {
        return <p>Cargando clima...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!climaPorDia || climaPorDia.length === 0) {
        return <p>No hay datos de clima disponibles.</p>;
    }

    const selectedDayData = climaPorDia[selectedDayIndex];

    return (
        <div className="clima-semanal-container">
            <div className="clima-tabs">
                {climaPorDia.map((day, index) => (
                    <button
                        key={day[0].fecha}
                        className={`clima-tab ${index === selectedDayIndex ? 'active' : ''}`}
                        onClick={() => setSelectedDayIndex(index)}
                    >
                        {getDayName(day[0].fecha, index)}
                    </button>
                ))}
            </div>
            <div className="clima-forecast">
                {selectedDayData?.map((forecast) => (
                        <div key={forecast.hora} className="forecast-item">
                            <p className="forecast-time">{forecast.hora.substring(0, 5)}</p>
                            <p className="forecast-icon">{getWeatherIcon(forecast.precipitacion_porcentaje, forecast.temperatura)}</p>
                            <p className="forecast-temp">{Math.round(forecast.temperatura)}°C</p>
                            <p className="forecast-precip">💧 {forecast.precipitacion_porcentaje}%</p>
                        </div>
                    ))}
            </div>
        </div>
    );
};

const ClimaHome = () => {
    return (
        <div className="clima-home">
            <h2>Clima Semanal</h2>
            <ClimaSemanal />
        </div>
    );
};

export default ClimaHome;