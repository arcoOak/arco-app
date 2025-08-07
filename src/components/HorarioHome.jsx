import './HorarioHome.css';

const formatearHoraAmPm = (hora) => {
    const [horas, minutos, segundos] = hora.split(':');
    let horaFormateada = parseInt(horas, 10);
    const amPm = horaFormateada >= 12 ? 'PM' : 'AM';
    horaFormateada = horaFormateada % 12 || 12;
    return `${horaFormateada}:${minutos} ${amPm}`;
}


const HorarioHome = ({ clubInfo }) => {
    const esActivo = clubInfo?.activo;
    const statusClass = esActivo ? 'status-abierto' : 'status-cerrado';
    const statusText = esActivo
        ? `${formatearHoraAmPm(clubInfo.hora_apertura)} - ${formatearHoraAmPm(clubInfo.hora_cierre)}`
        : 'Cerrado';
        
    return (
        <section className="horario-section">
            <h3 className="horario-title">Horario del Club</h3>
            <p className={`horario-text ${statusClass}`}>{statusText}</p>
        </section>
    )
}

export default HorarioHome;