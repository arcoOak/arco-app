import React from "react";
import "../css/Home.css";
import NewsSection from '../components/NewsSection'; // Importa tu componente Carousel
import MonthlyOverview from '../components/MonthlyOverview';
import ImageSlider from '../components/ImageSlider'; // Importa tu componente ImageSlider

export default function App() {
    return (
        <div className="app">
            {/* Header */}
            <header className="app-header">
                <div className="logo">Club</div>
                <div className="header-actions">
                    <span className="username">Johny Roria</span>
                </div>
            </header>

            {/* Estado de Cuotas */}
            <section className="dues-section">

                <ImageSlider />
                <div className="payment_action">
                    <button>
                        <i class='bx bxs-swap-horizontal'></i>
                        Tranferir
                    </button>
                    <button>
                        <i class='bx bxs-inbox'></i>
                        Recibir
                    </button>
                    <button>
                        <i class='bx bxs-wallet'></i>
                        Pagar
                    </button>
                </div>
                {/* <h2>Estado de Cuota</h2>
                <p>Estado: <span className="status pending">Pendiente</span></p>
                <p>Monto Adeudado: $50.000</p>
                <button>Pagar Ahora</button>
                <div className="progress-bar">
                    <div className="filled" style={{ width: "30%" }}></div>
                </div> */}
                <MonthlyOverview />
                <NewsSection /> {/* Aquí añades la sección de noticias */}
                <br /><br />
                <h2>Promociones Especiales</h2>
                <p>🍹 2x1 en tragos en el Bar de Playa</p>
                <p>🎾 20% en alquiler de cancha</p>
                <br /><br />
                <h2>Clima Actual</h2>
                <p>🌤️ 27°C - Soleado</p>
                <h3>Horarios</h3>
                <p>Club abierto: 8:00 - 22:00</p>
                <h3>Redes Sociales</h3>
                <p>@clubplayero</p>
            </section>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Oak Tree C.A.</p>
                <p>Todos los derechos reservados.</p>
                <p><a href="#">Política de Privacidad</a> | <a href="#">Términos de Uso</a></p>
            </footer>
        </div>
    );
}
