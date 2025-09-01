import '../css/notifications.css'
export default function Notifications() {
    return (
        <>
            <div className="notifaction-container">

                <div>
                    <div className="notification-header">
                        <h2>Enterate sobre asuntos importantes</h2>
                        <h3>Te notificaremos cuando</h3>
                    </div>

                    <div className="notification-contain">
                        <div className="notification-item"><i class="fa fa-calendar-day"></i> Tu pago esté próximo a vencer</div>
                        <div className="notification-item"><i class="fa fa-credit-card"></i> Hagas una compra</div>
                        <div className="notification-item"><i class="fa fa-gift"></i> Tengas recompensas</div>
                        <div className="notification-item"><i class="fa fa-user"></i> Acceda cualquier miembro</div>
                        <div className="notification-item"><i class="fa fa-bacon"></i> Una Orden de comida esté lista</div>
                    </div>
                </div>

                <div className="notification-settings">
                    <p>Puedes ajustar esta configuración en otro momento</p>
                    <div>
                        <button>Luego</button>
                        <button>Permitir</button>
                    </div>
                </div>
            </div>
        </>
    )
}