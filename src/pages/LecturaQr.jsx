import QRCode from 'react-qr-code';
import React, { useState, useEffect  } from 'react';
import './LecturaQr.css'; 

import QRTokenService from '../services/qrtoken.service'; // Importa el servicio para manejar los tokens QR

import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

function LecturaQr() {
    const { user} = useAuth(); // Obtiene el usuario autenticado desde el contexto
    const [qrTokenValue, setQrTokenValue] = useState(null); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {

        if (!user) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchQrToken = async () => {
            try {

                //const tokenGot = await QRTokenService.obtenerTokenQrPorUsuario(user.id_usuario, user.id_rol);

                //let newToken;
                //console.log(tokenGot);

                // if (tokenGot && tokenGot.token) {
                //      newToken = await QRTokenService.actualizarTokenQr(user.id_usuario, user.id_rol);
                //      setQrTokenValue(newToken.token);
                //  }else if(isMounted){
                //      newToken = await QRTokenService.crearTokenQr(user.id_usuario, user.id_rol);
                //      setQrTokenValue(newToken.token);
                // }

                const newToken = await QRTokenService.generarTokenQr(user.id_usuario, user.id_rol, signal);

                if (newToken && newToken.token) {
                    setQrTokenValue(newToken.token);
                }

            } catch (err) {
                if (err.name !== 'AbortError') {
                    // Solo muestra el error si NO es un error de cancelación
                    console.error(err);
                }
            } finally {
                setLoading(false);
            }
        };

        

        
        fetchQrToken();
        

        return () => {
            controller.abort();
        }

    }, [user]);

    return (
        <div className="page-container">
            <h1 className="page-title">Tu Código QR</h1>
            <div className="qr-code-box">
                <img src={user?.foto_perfil || './src/img/perfil.jpg'} className="profile-photo img" alt="Foto de perfil" />
                <h2 className="mb-2">{user?.nombre || 'Usuario'}</h2>
                <p>Escanea este código para ingresar:</p>
                {loading ? (
                    <div className="qr-loading"><p>Cargando...</p></div>
                ) : qrTokenValue ? (
                    <div style={{ background: 'white', padding: '16px' }}>
                        <QRCode value={qrTokenValue} size={256} />
                    </div>
                ) : (
                    <div className="qr-loading"><p>No se pudo generar el código QR.</p></div>
                )}
                <p className="mt-2 text-muted">Tú Código QR es privado</p>
            </div>
        </div>
    );
}

export default LecturaQr;