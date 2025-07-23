import React from 'react';
import '../css/terms.css';

const TermsOfUse = () => {
    return (
        <div className="terms-container">
            <div className="terms-content">
                <h1 className="terms-title">Términos de Uso</h1>

                <p>
                    Al usar nuestra aplicación, aceptas los siguientes términos y condiciones. Lee cuidadosamente antes de continuar.
                </p>

                <h2>1. Aceptación de los términos</h2>
                <p>
                    Al acceder y utilizar nuestra aplicación, estás aceptando cumplir con estos términos. Si no estás de acuerdo, no deberías usar la app.
                </p>

                <h2>2. Uso adecuado</h2>
                <p>
                    No debes usar la aplicación para fines ilegales, distribuir contenido no autorizado o violar los derechos de otros usuarios.
                </p>

                <h2>3. Propiedad intelectual</h2>
                <p>
                    Todos los contenidos, logos y recursos de la aplicación están protegidos por derechos de autor. No está permitido copiarlos sin autorización.
                </p>

                <h2>4. Cambios en los términos</h2>
                <p>
                    Podemos actualizar estos términos en cualquier momento. Te notificaremos de los cambios importantes dentro de la app o por correo.
                </p>

                <h2>5. Cancelación de cuenta</h2>
                <p>
                    Nos reservamos el derecho de suspender o eliminar cuentas que violen estos términos sin previo aviso.
                </p>

                <p className="terms-footer">
                    Última actualización: 15 de julio de 2025
                </p>
            </div>
        </div>
    );
};

export default TermsOfUse;
