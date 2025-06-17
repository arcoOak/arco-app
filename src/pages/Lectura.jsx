import QRCode from "qrcode.react";

export default function Qr() {
    // Simulación de ID de cliente, normalmente vendría desde contexto, props o fetch
    const clienteID = "cliente-574";
    const qrValue = `https://tuservidor.com/cliente/${clienteID}`;

    return (
        <div className="page-container">
            <h1 className="page-title">Tu Código QR</h1>
            <p>Escanea este código para ingresar:</p>

            <div className="qr-code-box">
                <QRCode
                    value={qrValue}
                    size={200}
                    level="H"
                    includeMargin={true}
                />
                <p className="mt-3 text-muted">ID asociado: {clienteID}</p>
            </div>
        </div>
    );
}

