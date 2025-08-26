/////////////////
/*
NOTAS


Se ha de agregar el limitador de beneficiarios por socio
Esto va de la mano con la tabla data_configuracion_club



*/ 


// src/components/FamilyMembersListScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Importa el componente QRCode
import './BeneficiariosLista.css';

import LoadingModal from '../../components/modals/LoadingModal'; 
import ExitosoModal from '../../components/modals/ExitosoModal';
import ModalFormulario from '../../components/modals/ModalFormulario'; 
import ConfirmarModal from '../../components/modals/ConfirmarModal';

import Button from '../../components/buttons/Button'; // Importa el botón personalizado

import FormatearFecha from '../../utils/FormatearFecha';
import { Edit } from 'lucide-react';

import dataService  from '../../services/data_db.service'; // Importa los servicios necesarios

import familiaresService from '../../services/familiares.service';

import { useAuth } from "../../context/AuthContext"; // Importa el contexto de autenticación

import ButtonVolver from '../../components/buttons/ButtonVolver'; // Importa el botón de volver


export default function BeneficiariosLista() {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [parentescos, setParentescos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user, login, logout , isAuthenticated } = useAuth();

    const [showExitosoModal, setShowExitosoModal] = useState(false);
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);

    const [modalMode, setModalMode] = useState(''); // 'add' o 'edit'

    const [dataBeneficiarioNuevo, setDataBeneficiarioNuevo] = useState({
        id_familiar: '',
        id_usuario: user.id_usuario, // Asumiendo que el ID del socio está en user.id_socio
        nombre: '',
        apellido: '',
        documento_identidad: '',
        fecha_nacimiento: '',
        id_genero: '',
        telefono: '',
        direccion: '',
        id_parentesco: ''
    });

    const [familiarIdToDelete, setFamiliarIdToDelete] = useState(null);

    const [showFormularioModal, setShowFormularioModal] = useState(false);

     const API_HOST = import.meta.env.VITE_API_HOST;

    useEffect(() => {
        // Cambia el ID por el que corresponda según tu lógica de autenticación
        setLoading(true);
        
        if (!user) return;

        const fetchInitialData = async () => {
            try {
                // 3. Usar Promise.all para ejecutar todas las peticiones en paralelo
                const [beneficiariesData, generosData, parentescosData] = await Promise.all([
                    familiaresService.getBeneficiariosBySocioId(user.id_usuario), // Usar el ID del usuario real
                    dataService.getGeneros(),
                    dataService.getParentescos()
                ]);
                setBeneficiaries(beneficiariesData);
                setGeneros(generosData);
                setParentescos(parentescosData);
            } catch(err) {
                console.error("Error al cargar datos iniciales:", err);
            }finally{
                setLoading(false);
            }
        }
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (showExitosoModal) {
            const timer = setTimeout(() => {
                setShowExitosoModal(false);
            }
            , 2000); // Mostrar el modal por 2 segundos
            return () => clearTimeout(timer);
        }
        }, [showExitosoModal]);

    const handleCloseModal = () => {

        setShowFormularioModal(false);

        // Limpiar el formulario al cerrar el modal

        
    }

    // Función para generar una URL de QR de demostración
    // En un caso real, esta URL provendría de tu backend
    const generateQrCodeData = (cedula, id) => {
        // Idealmente, aquí usarías una URL de tu aplicación que resuelva al perfil del beneficiario
        // Por ejemplo: `https://tudominio.com/beneficiario/${id}`
        // Para demostración, usaremos un servicio público de QR que codifica texto.
        // Asegúrate de que los datos codificados sean únicos para cada beneficiario.
        return `Socio:${user.id_socio}-Beneficiario:${id}-CI:${cedula}`;
    };


    const handleAddMemberClick = () => {
        setDataBeneficiarioNuevo({
            id_familiar: '',
            id_usuario: user.id_usuario, // Asumiendo que el ID del socio está en user.id_socio
            nombre: '',
            apellido: '',
            documento_identidad: '',
            fecha_nacimiento: '',
            id_genero: '',
            telefono: '',
            direccion: '',
            id_parentesco: ''
        });
        setModalMode('add');
        setShowFormularioModal(true);
    };

    const handleEditMember = (familiar_id) => {
        const beneficiarioEditable = beneficiaries.find(b => b.id_familiar === familiar_id);
        if(beneficiarioEditable){
            setDataBeneficiarioNuevo({
                ...beneficiarioEditable, id_familiar:familiar_id
            })
        }

        //console.log("Datos del beneficiario a editar:", dataBeneficiarioNuevo);

        setModalMode('edit');
        
        setShowFormularioModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataBeneficiarioNuevo(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleDeleteMember = (familiar_id) => {
        //console.log("ID del beneficiario a eliminar:", familiar_id);

        // Mostrar confirmación antes de eliminar
        setShowConfirmarModal(true);
        setFamiliarIdToDelete(familiar_id);


    }

    const handleConfirmacion = (confirmar) => {
        //console.log("Confirmación:", confirmar);
        setShowConfirmarModal(false);

        if (confirmar) {
            // Aquí puedes realizar la acción de confirmación, como eliminar el beneficiario
            // Por ejemplo, si estás eliminando un beneficiario:
            // handleDeleteMember(dataBeneficiarioNuevo.id_familiar);
            EliminarBeneficiario(familiarIdToDelete);
        } 
    }

    const EliminarBeneficiario = async (familiar_id) => {
        //console.log(familiar_id)
        fetch(`${API_HOST}/api/familiares/${familiar_id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el beneficiario. Código: ' + response.status);
                }
                setBeneficiaries(prev => prev.filter(b => b.id_familiar !== familiar_id));
                setShowExitosoModal(true);
            })
            .catch(error => {
                console.error("Error al eliminar beneficiario:", error);
                alert('Error al eliminar el beneficiario: ' + error.message);
            });
    }

    const AnadirBeneficiario = async (data)=>{ 

        //console.log("Datos del nuevo beneficiario:", data);

        try {
            const response = await fetch(`${API_HOST}/api/familiares`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Error al agregar el beneficiario. Código: ' + response.status);
            }
            const newBeneficiary = await response.json();
            // Generar el código QR para el nuevo beneficiario
            // newBeneficiary.qrCodeData = generateQrCodeData(newBeneficiary.documento_identidad, newBeneficiary.id_familiar);
            setBeneficiaries(prev => [...prev, newBeneficiary]);
            setShowExitosoModal(true);
        } catch (error) {
            console.error("Error al agregar beneficiario:", error);
            alert('Error al agregar el beneficiario: ' + error.message);
        }

        handleCloseModal(false);

        

        

    }

    const EditarBeneficiario = async (data) => {

        const { id_familiar, nombre, apellido, documento_identidad, fecha_nacimiento, id_genero, telefono, direccion, id_parentesco } = data;
        const dataRequerida ={nombre, apellido, documento_identidad, fecha_nacimiento, id_genero, telefono, direccion, id_parentesco};

        //console.log("Datos del beneficiario a editar:", dataRequerida);
        try {
            const response = await fetch(`${API_HOST}/api/familiares/${data.id_familiar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataRequerida),
            });
            if (!response.ok) {
                throw new Error('Error al editar el beneficiario. Código: ' + response.status);
            }
            const updatedBeneficiary = await response.json();
            // Generar el código QR para el beneficiario editado
            // updatedBeneficiary.qrCodeData = generateQrCodeData(updatedBeneficiary.documento_identidad, updatedBeneficiary.id_familiar);
            setBeneficiaries(prev => prev.map(b => b.id_familiar == updatedBeneficiary.id_familiar ? updatedBeneficiary : b));
            setShowExitosoModal(true);
        } catch (error) {
            console.error("Error al editar beneficiario:", error);
            alert('Error al editar el beneficiario: ' + error.message);
        }

        handleCloseModal(false);


    }


    return (
        <React.Fragment>
        <LoadingModal visible={loading}>Cargando...</LoadingModal>
        <ConfirmarModal onConfirm={()=>handleConfirmacion(true)} onCancel={()=>handleConfirmacion(false)} visible={showConfirmarModal}></ConfirmarModal>
        <ExitosoModal visible={showExitosoModal}></ExitosoModal>
        <ButtonVolver to="/perfil" className="boton-volver" />
        <div className="family-list-container">
            <div className="family-list-header">
                <h2>Mis Beneficiarios</h2>
            </div>

            

            
                <div className="family-members-grid">
                    {beneficiaries.map((member) => (
                        <div key={member.id_familiar} className="family-member-card">
                            <img src={member.photo || '../../src/assets/user_placeholder.svg'} alt={`${member.nombre} ${member.apellido}`} className="member-photo" />
                            <div className="member-details">
                                <h3>{member.nombre} {member.apellido}</h3>
                                <p><i className='fas fa-id-card'></i> <b>C.I.:</b> {member.documento_identidad}</p>
                                <p><i className='fas fa-calendar-alt'></i> <b>Año Nac.:</b> {FormatearFecha(member.fecha_nacimiento)}</p>
                                <p><i className='fas fa-users'></i> <b>Parentesco:</b> {member.nombre_parentesco}</p>
                            </div>
                            {member.qrCodeData && ( //Sección del QR
                                <div className="qr-code-container">
                                    <QRCode
                                        value={member.qrCodeData}
                                        size={70} // Tamaño del QR
                                        level="L" // Nivel de corrección de error (L, M, Q, H)
                                    />
                                    
                                </div>
                            )}
                            <div className="member-actions">
                                <i className='fas fa-edit' onClick={() => handleEditMember(member.id_familiar)}></i>
                                <i className='fas fa-trash' onClick={() => handleDeleteMember(member.id_familiar)}></i>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="add-member-button-container">

                    <Button
                        onClick={handleAddMemberClick}
                        className={"secondary"}
                    >
                        <i className='fas fa-user'></i> Agregar Nuevo
                    </Button>
                </div>
            
        </div>

            <ModalFormulario
                onClose={() => handleCloseModal(false)}   
                onSubmit={() =>
                        modalMode === 'add'
                            ? AnadirBeneficiario(dataBeneficiarioNuevo)
                            : EditarBeneficiario(dataBeneficiarioNuevo)
                    }                visible={showFormularioModal}
                titulo={modalMode === 'add' ? "Agregar Beneficiario"  : "Editar Beneficiario"}
                data={dataBeneficiarioNuevo}
            >
                    
                        <label className='box-form-container-label' htmlFor="nombre">Nombre</label>
                        <input className='box-form-container-input' value={dataBeneficiarioNuevo.nombre} onChange={handleChange} type="text" name="nombre" placeholder="Nombre" required />
                    
                        <label className='box-form-container-label' htmlFor="apellido">Apellido</label>
                        <input className='box-form-container-input' value={dataBeneficiarioNuevo.apellido} onChange={handleChange} type="text" name="apellido" placeholder="Apellido" required />
                    
                        <label className='box-form-container-label' htmlFor="documento_identidad">Cédula de Identidad</label>
                        <input className='box-form-container-input' value={dataBeneficiarioNuevo.documento_identidad} onChange={handleChange} type="number" name="documento_identidad" placeholder="Cédula de Identidad" required />
                    
                        <label className='box-form-container-label' htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
                        <input className='box-form-container-input' value={dataBeneficiarioNuevo.fecha_nacimiento.slice(0,10)} onChange={handleChange} type="date" name="fecha_nacimiento" required />
                   
                        <label className='box-form-container-label' htmlFor="telefono">Teléfono</label>
                        <input className='box-form-container-input' value={dataBeneficiarioNuevo.telefono} onChange={handleChange} type="text" name="telefono" placeholder="Teléfono" required />
                    
                        <label className='box-form-container-label' htmlFor="direccion">Dirección</label>
                        <input className='box-form-container-input' value={dataBeneficiarioNuevo.direccion} onChange={handleChange} type="text" name="direccion" placeholder="Dirección" required />
                    
                        <label className='box-form-container-label' htmlFor="id_genero">Género</label>
                        <select className='box-form-container-input' value={dataBeneficiarioNuevo.id_genero} onChange={handleChange} name="id_genero" required>
                            <option value="" disabled defaultValue>Selecciona un género</option>
                            {
                                generos &&
                                generos.map(genero => (
                                    <option key={genero.id_genero} value={genero.id_genero}>{genero.nombre_genero}</option>
                                ))
                            }
                        </select>
                    
                        <label className='box-form-container-label' htmlFor="id_parentesco">Parentesco</label>
                        <select className='box-form-container-input' value={dataBeneficiarioNuevo.id_parentesco} onChange={handleChange} name="id_parentesco" required>
                            <option value="" disabled defaultValue>Selecciona un parentesco</option>
                            {   parentescos &&
                                parentescos.map(parentesco => (
                                    <option key={parentesco.id_parentesco} value={parentesco.id_parentesco}>{parentesco.nombre_parentesco}</option>
                                ))
                            }
                        </select>
                    


                </ModalFormulario>      

        </React.Fragment>
    );
}