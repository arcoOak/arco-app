import React, {useState, useEffect} from 'react';
import './EspacioReservaModal.css';

import {useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación

import ModalFormulario from '../../components/modals/ModalFormulario';
import Button from '../../components/buttons/Button'; // Importa el botón de confirmar

import familiaresService from '../../services/familiares.service'; // Importa el servicio de familiares


export default function ConfirmacionReservaModal({
    visible,
    onClose,
    onConfirm,
    espacio,
    unidadSeleccionada,
    fecha,
    horarios,
    costeTotal,
    nota,
    setNota,
    familiares,
    setFamiliares,
    invitados,
    setInvitados,
}) {
    if (!visible) {
        return null;
    }

    const { user } = useAuth(); // Obtiene el usuario autenticado desde el contexto
    const [loading, setLoading] = useState(false);
    const [listaFamiliares, setListaFamiliares] = useState([]);

    const [showModalFormulario, setShowModalFormulario] = useState(false);

    const [dataInvitadoNuevo, setDataInvitadoNuevo] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        documento_identidad: ''
    });

    

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                
                const familiaresList = await familiaresService.getBeneficiariosBySocioId(user.id_usuario);
                //console.log('Beneficiarios:', familiaresList);
                setListaFamiliares(familiaresList);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        } 

        fetchData();

    }, []);


    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatearHorarios = (horarios) => {
        if (!horarios || horarios.length === 0) {
            return [];
        }

        // Sort the array to ensure consecutive hours are next to each other
        const sortedHorarios = [...horarios].sort((a, b) => a - b);
        const result = [];
        let startHour = parseInt(sortedHorarios[0]);
        let endHour = parseInt(sortedHorarios[0]);

        for (let i = 0; i < sortedHorarios.length; i++) {
            const currentHour = parseInt(sortedHorarios[i]);
            const nextHour = parseInt(sortedHorarios[i + 1]);

            if (currentHour + 1 === nextHour) {
            // If the next hour is consecutive, extend the current range
            endHour = nextHour;
            } else {
            // If not consecutive, or if it's the last hour,
            // finalize the current range and add it to the result
            let formattedStart = `${startHour.toString().padStart(2, '0')}:00`;
            let formattedEnd = `${(endHour + 1).toString().padStart(2, '0')}:00`;

            // Handle the case where 23:00 - 00:00 should be 23:00 - 24:00 (or similar)
            if (endHour === 23) {
                formattedEnd = '00:00'; // For 23:00 to 00:00 (next day)
            }

            result.push(`${formattedStart} - ${formattedEnd}`);

            // Reset start and end for the next potential range
            if (nextHour !== undefined) {
                startHour = nextHour;
                endHour = nextHour;
            }
            }
        }
        return result;
        };
    
    //console.log( 'formatearHorarios', formatearHorarios(horarios) );

    const handleToggleFamiliar = (familiarReservacion, id_rol) => {
        const familiar = { id_familiar: familiarReservacion.id_familiar, id_rol: id_rol, nombre: familiarReservacion.nombre, apellido: familiarReservacion.apellido, tipo: 'familiar' };  //  Asegúrate de unificar la estructura con invitados (si es necesario, añade más campos)
        if (!familiares.some(f => f.id_familiar === familiar.id_familiar)) {  //  Comprobación con el nuevo id
            console.log('Añadiendo familiar:', familiar);
            setFamiliares([...familiares, familiar]); // Actualiza la lista de familiares seleccionados
        } else {
            console.log('Familiar ya agregado:', familiar);
            // Si el familiar ya está en la lista, lo eliminamos
            setFamiliares(familiares.filter(f => f.id_familiar !== familiar.id_familiar)); //  Filtra por el nuevo id
        }
    };

    const handleAnadirInvitado = (invitado) => {
        const invitadoUnidad = { 
            key: invitados.length + 1,
            nombre: invitado.nombre,
            apellido: invitado.apellido,
            correo: invitado.correo,
            documento_identidad: invitado.documento_identidad,
         };

        setInvitados([...invitados, invitadoUnidad]);
        console.log('lista de invitados actualizada:', [...invitados, invitadoUnidad]);

    };

    const familiarYaAgregado = (familiar) => {
        //console.log("familiar.id:", familiar);
        //console.log("familiares:", familiares);
        return familiares.some(f => f.id_familiar === familiar.id_familiar  );
    }

    const invitadoYaAgregado = (documento_identidad) => {
        return invitados.some(inv => inv.documento_identidad === documento_identidad);
    }

    const handleToggleModalFormulario = () => {
        setShowModalFormulario(!showModalFormulario);
        setDataInvitadoNuevo({
            nombre: '',
            apellido: '',
            correo: '',
            documento_identidad: ''
        });
    }


    const handleCrearInvitado = async (formData) => {

        handleAnadirInvitado(formData);
        
        handleToggleModalFormulario();
    }

    const removeInvitado = (documento_identidad) => {
        setInvitados(invitados.filter(inv => inv.documento_identidad !== documento_identidad));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataInvitadoNuevo(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <React.Fragment>

        

        <ModalFormulario
            visible={showModalFormulario}
            onClose={() => handleToggleModalFormulario()}
            onSubmit={() => handleCrearInvitado(dataInvitadoNuevo)}
            titulo={"Crear Invitado"}
            data = {dataInvitadoNuevo}
        >
            
            <label className='box-form-container-label' htmlFor="nombre">Nombre</label>
            <input className='box-form-container-input' value={dataInvitadoNuevo.nombre} onChange={handleChange} type="text" name="nombre" placeholder="Nombre" required />
                    
            <label className='box-form-container-label' htmlFor="apellido">Apellido</label>
            <input className='box-form-container-input' value={dataInvitadoNuevo.apellido} onChange={handleChange} type="text" name="apellido" placeholder="Apellido" required />
                    
            <label className='box-form-container-label' htmlFor="documento_identidad">Cédula de Identidad</label>
            <input className='box-form-container-input' value={dataInvitadoNuevo.documento_identidad} onChange={handleChange} type="number" name="documento_identidad" placeholder="Cédula de Identidad" required />
                    
            <label className='box-form-container-label' htmlFor="correo">Correo</label>
            <input className='box-form-container-input' value={dataInvitadoNuevo.correo} onChange={handleChange} type="text" name="correo" placeholder="Correo" required />

        </ModalFormulario>
        <div className="modal-overlay">
            <div className="modal-content">

                <h2 className='reserva-modal__title'>Confirmar Reserva</h2>

                <div className='modal-content-block'>

                    <div className='reserva-modal__info'>
                        <p className='reserva-modal__text'><strong>Espacio:</strong> {espacio?.nombre_espacio_reservable}</p>
                    
                        {unidadSeleccionada && <p className='reserva-modal__text'><strong>Unidad:</strong> {unidadSeleccionada.nombre_unidad}</p>}
                    </div>

                    <div className='reserva-modal__info'>
                        <p className='reserva-modal__text'><strong>Fecha:</strong> {formatearFecha(fecha)}</p>

                        <p className='reserva-modal__text'><strong>Horarios:</strong></p>
                        <ul className='reserva-modal__horarios'>
                            {formatearHorarios(horarios).map((horario, index) => (
                                <li key={index}>{horario}</li>
                            ))}
                        </ul>
                    </div>

                    <div className='reserva-modal__info'>
                        <p className='reserva-modal__text'><strong>Coste Total:</strong> ${costeTotal}</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="nota">Añadir una nota (opcional)</label>
                        <textarea
                            id="nota"
                            value={nota}
                            className='reserva-modal__textarea'
                            onChange={(e) => setNota(e.target.value)}
                            rows="3"
                            placeholder="Instrucciones especiales, etc."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="invitados">Invitar Beneficiarios (opcional)</label>
                        <div className="reserva-modal__invitados">
                            {
                                listaFamiliares.length > 0 && (
                                    listaFamiliares.map((familiar) => (
                                        <div 
                                            key={familiar.id_familiar} 
                                            className={`reserva-modal__invitado ${familiarYaAgregado(familiar) ? 'seleccionado' : ''}`}
                                            onClick={() => handleToggleFamiliar(familiar, 3)}
                                        >
                                            <p>
                                                {familiar.nombre} {familiar.apellido}
                                            </p>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                        
                    </div>

                    <div className="form-group">
                            {
                                invitados.length > 0 && (
                                    <label htmlFor="invitados">Invitados (opcional)</label>
                                )
                            }
                        <div className="reserva-modal__invitados">
                            
                            
                            {
                                invitados.length > 0 && (
                                    invitados.map((invitadoUnico, idx) => (
                                        <div
                                            key={idx}
                                            className={`reserva-modal__invitado ${invitadoYaAgregado(invitadoUnico.documento_identidad) ? 'seleccionado' : ''}`}
                                            onClick={() => removeInvitado(invitadoUnico.documento_identidad)}
                                        >
                                            <p>
                                                {invitadoUnico.nombre} {invitadoUnico.apellido}
                                            </p>
                                        </div>
                                    ))
                                )
                                
                            }
                        </div>

                        <Button
                            className='tertiary big'
                            onClick={() => handleToggleModalFormulario()}
                        >
                            Añadir Invitado
                        </Button>
                    
                    </div>

                </div>

                <div className="modal-actions">
                    <Button
                        className='primary'
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Confirmar'}
                    </Button>
                    <Button
                        className='neutral'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    
                </div>
            </div>
        </div>
        </React.Fragment>
    );
}

