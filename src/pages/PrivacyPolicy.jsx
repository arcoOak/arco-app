import React from 'react';
import '../css/privacy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container">
            <div className="privacy-content">
                <h1 className="privacy-title">Política de Privacidad</h1>

                <p>
                    En nuestra aplicación, tu privacidad es muy importante. Esta política explica qué datos recopilamos, cómo los usamos y tus derechos al respecto.
                </p>

                <h2>1. Información que recopilamos</h2>
                <p>
                    Recopilamos información básica como tu nombre, correo electrónico y actividad dentro de la aplicación con el fin de mejorar la experiencia del usuario.
                </p>

                <h2>2. Uso de la información</h2>
                <p>
                    Usamos tus datos para personalizar el contenido, mejorar el rendimiento del sistema y ofrecer soporte técnico cuando sea necesario.
                </p>

                <h2>3. Compartir datos</h2>
                <p>
                    No compartimos tu información personal con terceros, excepto cuando sea requerido por la ley o con tu consentimiento explícito.
                </p>

                <h2>4. Seguridad</h2>
                <p>
                    Implementamos medidas de seguridad para proteger tus datos contra accesos no autorizados y pérdidas accidentales.
                </p>

                <h2>5. Tus derechos</h2>
                <p>
                    Puedes acceder, corregir o eliminar tu información personal contactando con nuestro equipo de soporte.
                </p>

                <p className="privacy-footer">
                    Última actualización: 15 de julio de 2025
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
