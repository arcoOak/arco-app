import QRCode from 'react-qr-code';
import React, { useState, useEffect  } from 'react';
import './LecturaQr.css'; 

import QRTokenService from '../../services/qrtoken.service'; // Importa el servicio para manejar los tokens QR
import InvitacionesQRService from '../../services/invitaciones_correo.service'; // Importa el servicio para manejar las invitaciones QR

import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación
import InvitacionQR from './InvitacionQr';

import ExitosoModal from '../../components/modals/ExitosoModal'; // Importa el modal de éxito

import Button from '../../components/buttons/Button'; // Asegúrate de tener un componente Button reutilizable


function LecturaQr() {
    const { user, isDarkTheme } = useAuth(); // Obtiene el usuario autenticado desde el contexto
    const [qrTokenValue, setQrTokenValue] = useState(null); 
    const [qrTokenInvitado, setQrTokenInvitado] = useState('');

    const [showInvitacionQr, setShowInvitacionQr] = useState(false);

    const [showExitosoModal, setShowExitosoModal] = useState(false);

    const [loading, setLoading] = useState(true); 

    useEffect(() => {

        if (!user) {
            setLoading(false);
            return;
        }

        const controller = new AbortController(); // Crea un controlador para abortar la solicitud
        const signal = controller.signal; // Crea una señal para la solicitud

        const fetchQrToken = async () => {
            try {

                const newToken = await QRTokenService.generarTokenQr(user.id_usuario, user.id_rol, signal);

                if (newToken && newToken.token) {
                    setQrTokenValue(newToken.token);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
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


    const handleShowInvitacionQr = async (invitado) => {
        //console.log('handleShowInvitacionQr', invitado);

        let response;
            let invitacionResponse;

        try{

            

            if( invitado && invitado.type === 'beneficiarios'){
                response = await QRTokenService.generarTokenQrFamiliar(user.id_usuario, 3, invitado.data.id_familiar);
                invitacionResponse = await InvitacionesQRService.enviarInvitacionQr(user.id_usuario, 3, invitado.data);
            }else if (invitado && invitado.type === 'nuevo-invitado') {
                response = await QRTokenService.generarTokenQrInvitado(user.id_usuario, 4, invitado.data);
                invitacionResponse = await InvitacionesQRService.enviarInvitacionQr(user.id_usuario, 4, invitado.data);
            }

            setShowExitosoModal(true);
            setTimeout(() => {
                setShowExitosoModal(false);
            }, 2000);

            console.log('Token QR generado:', response);

            setQrTokenInvitado(response.token);

        } catch (error) {
            console.error('Error al generar el token QR o enviar la invitación:', error);
            return;
        } finally{

            setShowInvitacionQr(false)
        }
    }

    return (
        <React.Fragment>
            <ExitosoModal
                visible={showExitosoModal}
                mensaje={'Invitación enviada exitosamente'}
                
            ></ExitosoModal>
            <InvitacionQR
                visible={showInvitacionQr}
                onClose={() => setShowInvitacionQr(false)}
                onConfirm={handleShowInvitacionQr}
            
            ></InvitacionQR>
        <div className="page-container">
            
            <div className="qr-code-box">
                <div className='qr-code-info'>
                    
                    <img src={user?.foto_perfil || './src/img/perfil.jpg'} className="profile-photo img" alt="Foto de perfil" />
                    <h1 className={`page-title ${isDarkTheme ? 'title-darkMode' : ''}`}>Tu Código QR</h1>
                    <h2 className="mb-2">{user?.nombre + ' ' + user?.apellido || 'Usuario'}</h2>
                    <p>Escanea este código para ingresar:</p>
                </div>
                
                {loading ? (
                    <div className="qr-loading"><p>Cargando...</p></div>
                ) : qrTokenValue ? (
                    <div className="qr-code">
                        <QRCode value={qrTokenValue} size={256} />
                    </div>
                ) : (
                    <div className="qr-loading"><p>No se pudo generar el código QR.</p></div>
                )}

                <p className="mt-2 text-muted">Tú Código QR es privado</p>

                <div className='qr-code-actions'>
                    <Button
                        onClick={() => setShowInvitacionQr(true)}
                        className={'primary big'}
                    >
                        Enviar Invitación
                    </Button>
                </div>

                {/* <div>
                    <QRCode value={qrTokenInvitado} size={256} />
                </div> */}
            </div>
        </div>
        </React.Fragment>
    );
}

export default LecturaQr;