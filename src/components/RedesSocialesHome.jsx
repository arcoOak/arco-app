import { useAuth } from "../context/AuthContext";

import './RedesSocialesHome.css'; // Asegúrate de tener un archivo CSS para los estilos

const RedesSocialesHome = () => {
    const { clubInfo } = useAuth();

    if (!clubInfo || (!clubInfo.facebook && !clubInfo.instagram && !clubInfo.twitter)) {
        return null;
    }

    return (
        <section className="redes-sociales-home">
            <h3 className="redes-sociales-title">Redes Sociales</h3>
            <ul className="redes-sociales-list">
                {
                    clubInfo.facebook && <li className="rrss-icon">
                    <a  href={clubInfo.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-facebook"></i> Facebook
                    </a>
                </li>}
                {clubInfo.instagram && <li className="rrss-icon">
                    <a href={clubInfo.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-instagram"></i> Instagram
                    </a>
                </li>}
                {clubInfo.tiktok && <li className="rrss-icon">
                    <a href={clubInfo.tiktok} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-tiktok"></i> TikTok
                    </a>
                </li>}
            </ul>
        </section>
    )
}

export default RedesSocialesHome;