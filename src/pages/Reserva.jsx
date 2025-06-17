export default function Reserva() {
    return (
        <div className="page-container">
            <h1 className="page-title">Reservas</h1>
            <p>Aquí puedes ver o gestionar tus reservas.</p>

            {/* Ejemplo de lista de reservas */}
            <ul className="reservation-list">
                <li>Reserva #1 - 12 de julio, 10:00 a.m.</li>
                <li>Reserva #2 - 20 de julio, 3:00 p.m.</li>
            </ul>
        </div>
    );
}
