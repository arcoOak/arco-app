//import QRCode from "qrcode.react";

export default function Qr() {
    // Simulación de ID de cliente, normalmente vendría desde contexto, props o fetch
    const clienteID = "cliente-574";
    //const qrValue = `https://tuservidor.com/cliente/${clienteID}`;

    return (
        <div className="page-container">
            <h1 className="page-title mt-2">Tu Código QR</h1>
            

            <div className="qr-code-box">
                <img src="./src/img/perfil.jpg"  className="profile-photo img" />
                <h2 className="mb-2">Johny Roria</h2>
                <p>Escanea este código para ingresar:</p>
                <img src="./src/img/qr.png" className="img-qr" alt="" />
                <p className="mt-2 text-muted">Tú Código QR es privado</p>
            </div>
        </div>
    );
}

