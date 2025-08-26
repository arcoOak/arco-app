import React, {useState, useEffect} from 'react';
import './InvitacionQr.css';

import {useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import familiaresService from '../../services/familiares.service'; // Importa el servicio de familiares

import Button from '../../components/buttons/Button'; // Asegúrate de que la ruta sea correcta

const FORM_MODES = {
    BENEFICIARIOS: 'beneficiarios',
    NUEVO_INVITADO: 'nuevo-invitado',
};


export default function InvitacionQR({visible, onConfirm, onClose }) {
    if (!visible) {
        return null;
    }
    const { user } = useAuth(); // Obtiene el usuario autenticado desde el contexto
    const [loading, setLoading] = useState(false);
    const [listaFamiliares, setListaFamiliares] = useState([]);
    const [formMode, setFormMode] = useState(FORM_MODES.BENEFICIARIOS);
    const [familiarSeleccionado, setFamiliarSeleccionado] = useState(null);
    const [nuevoInvitadoData, setNuevoInvitadoData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        documento_identidad: ''
    });

    

    useEffect(() => {

        if (!visible || !user?.id_usuario) return;


        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            setLoading(true);
            try {

                const familiaresList = await familiaresService.getBeneficiariosBySocioId(user.id_usuario, signal);
                setListaFamiliares(familiaresList);
                
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error fetching data:', error);
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        } 
        fetchData();

        return () => {
            controller.abort();
        };

    }, [visible, user?.id_usuario]);

    const esCorreoValido = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
        return regex.test(correo);
    }


    const handleCloseAndReset = () => {

        setFamiliarSeleccionado(null);
        setFormMode(FORM_MODES.BENEFICIARIOS);
        setNuevoInvitadoData({
            nombre: '',
            apellido: '',
            correo: '',
            documento_identidad: ''
        });
        
        onClose();
    }

    const handleChangeNuevoInvitado = (e) => {
        const { name, value } = e.target;
        setNuevoInvitadoData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const isNuevoInvitadoFormValid = 
        nuevoInvitadoData.nombre.trim() !== '' &&
        nuevoInvitadoData.apellido.trim() !== '' &&
        nuevoInvitadoData.documento_identidad.trim() !== '' &&
        nuevoInvitadoData.correo.trim() !== '' &&
        esCorreoValido(nuevoInvitadoData.correo);

    const handleConfirm = () => {
        if (formMode === FORM_MODES.NUEVO_INVITADO) {
            if (!isNuevoInvitadoFormValid) {
                // Manejar errores de validación
                return;
            }
            onConfirm({
                type: FORM_MODES.NUEVO_INVITADO,
                data: nuevoInvitadoData
            });
        } else if (formMode === FORM_MODES.BENEFICIARIOS && familiarSeleccionado) {
            onConfirm({
                type: FORM_MODES.BENEFICIARIOS,
                data: familiarSeleccionado
            });
        }

        handleCloseAndReset();
    }




    


    return (
        <React.Fragment>
        <div className="modal-overlay">
            <div className="modal-content">

                <h2 className='invitacion-qr__title'>Enviar Invitación</h2>

                <div className='invitacion-qr__button-group'>
                    <button onClick={() => setFormMode(FORM_MODES.BENEFICIARIOS)} className={`button-form-mode ${formMode === FORM_MODES.BENEFICIARIOS ? 'active' : ''}`}>Beneficiarios</button>
                    <button onClick={() => setFormMode(FORM_MODES.NUEVO_INVITADO)} className={`button-form-mode ${formMode === FORM_MODES.NUEVO_INVITADO ? 'active' : ''}`}>Invitado</button></div>

                {formMode === FORM_MODES.BENEFICIARIOS ? (
                    <BeneficiariosSelector 
                        familiares={listaFamiliares}
                        selectedId={familiarSeleccionado?.id_familiar}
                        onSelect={setFamiliarSeleccionado}
                    />
                ) : (
                    <NuevoInvitadoForm 
                        data={nuevoInvitadoData}
                        onChange={handleChangeNuevoInvitado}
                    />
                )}

              

                <div className="invitacion-qr__actions">

                    <Button onClick={handleConfirm} className="primary" 
                    disabled={
                        loading || 
                        (formMode === FORM_MODES.BENEFICIARIOS && !familiarSeleccionado) ||
                        (formMode === FORM_MODES.NUEVO_INVITADO && !isNuevoInvitadoFormValid )

                    }>
                        {loading ? 'Procesando...' : 'Enviar'}
                    </Button>
                    <Button onClick={handleCloseAndReset} className="neutral" disabled={loading}>
                        Cancelar
                    </Button>
                    
                </div>
            </div>
        </div>
        </React.Fragment>
    );
}

function BeneficiariosSelector({ familiares, selectedId, onSelect }) {
    const handleSelect = (familiar) => {
        if (selectedId === familiar.id_familiar) {
            onSelect(null); // Deseleccionar
        } else {
            onSelect(familiar);
        }
    };

    return (
        <div className="invitacion-qr__form-group">
            <h3>Beneficiarios</h3>
            <div className="invitacion-qr__beneficiarios-list">
                {familiares.length > 0 ? (
                    familiares.map((familiar) => (
                        <button
                            key={familiar.id_familiar} 
                            type="button"
                            className={`invitacion-qr__beneficiario-btn ${selectedId === familiar.id_familiar ? 'selected' : ''}`}
                            onClick={() => handleSelect(familiar)}
                        >
                            {familiar.nombre} {familiar.apellido}
                        </button>
                    ))
                ) : (
                    <p>No se encontraron beneficiarios.</p>
                )}
            </div>
        </div>
    );
}

function NuevoInvitadoForm({ data, onChange }) {
    return (
        <div className="invitacion-qr__form-group">
            <h3>Datos del Invitado</h3>
            
            {/* <label className='invitacion-qr__label' htmlFor="nombre">Nombre</label> */}
            <input id="nombre" className='invitacion-qr__input' value={data.nombre} onChange={onChange} type="text" name="nombre" placeholder="Nombre" required />
            
            {/* <label className='invitacion-qr__label' htmlFor="apellido">Apellido</label> */}
            <input id="apellido" className='invitacion-qr__input' value={data.apellido} onChange={onChange} type="text" name="apellido" placeholder="Apellido" required />
            
            {/* <label className='invitacion-qr__label' htmlFor="documento_identidad">Cédula de Identidad</label> */}
            <input id="documento_identidad" className='invitacion-qr__input' value={data.documento_identidad} onChange={onChange} type="text" inputMode="numeric" name="documento_identidad" placeholder="Cédula de Identidad" required />
            
            {/* <label className='invitacion-qr__label' htmlFor="correo">Correo</label> */}
            <input id="correo" className='invitacion-qr__input' value={data.correo} onChange={onChange} type="email" name="correo" placeholder="Correo" required />
        </div>
    );
}

