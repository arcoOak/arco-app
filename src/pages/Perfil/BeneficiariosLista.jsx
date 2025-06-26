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

import FormatearFecha from '../../utils/FormatearFecha';
import { Edit } from 'lucide-react';


export default function BeneficiariosLista({ userId }) {
    const navigate = useNavigate();
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [parentescos, setParentescos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showExitosoModal, setShowExitosoModal] = useState(false);
    const [showConfirmarModal, setShowConfirmarModal] = useState(false);

    const [modalMode, setModalMode] = useState(''); // 'add' o 'edit'

    const [dataBeneficiarioNuevo, setDataBeneficiarioNuevo] = useState({
        id_familiar: '',
        id_usuario: userId,
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
        fetch(`${API_HOST}/api/familiares/buscar/1`)
            .then(res => res.json())
            .then(data => {

                setBeneficiaries(data);

                setLoading(false);
            })
            .catch(() => setLoading(false));
        
        // Cargar géneros
        fetch(`${API_HOST}/api/data/generos`).then(res => res.json())
            .then(data => {
                setGeneros(data);
            })
            .catch(err => {
                console.error("Error fetching generos:", err);
                //setError("Error al cargar géneros");
            });

        // Cargar parentescos
        fetch(`${API_HOST}/api/data/parentesco/genero`).then(res => res.json())
            .then(data => {
                setParentescos(data);
            })
            .catch(err => {
                console.error("Error fetching parentescos:", err);
                //setError("Error al cargar parentescos");
            });

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
        // O simplemente un texto que identifique al beneficiario: `Beneficiario:${cedula}`
        // Para demostración, usaremos un servicio público de QR que codifica texto.
        // Asegúrate de que los datos codificados sean únicos para cada beneficiario.
        return `Socio:${userId}-Beneficiario:${id}-CI:${cedula}`;
    };

    // const fetchBeneficiaries = useCallback(async () => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const response = await new Promise(resolve => setTimeout(() => {
    //             const dummyData = [
    //                 {
    //                     id: 'fam1',
    //                     name: 'María',
    //                     lastName: 'Hernández',
    //                     cedula: 'V-00998877',
    //                     birthYear: 1988,
    //                     relationship: 'Esposo',
    //                     photo: '../src/img/beneficiarios/beneficiario2.jpg'
    //                 },
    //                 {
    //                     id: 'fam2',
    //                     name: 'Ana',
    //                     lastName: 'Roria',
    //                     cedula: 'V-11223344',
    //                     birthYear: 2010,
    //                     relationship: 'Hija',
    //                     photo: '../src/img/beneficiarios/beneficiario1.jpg'
    //                 },
    //                 {
    //                     id: 'fam3',
    //                     name: 'Carlos',
    //                     lastName: 'Roria',
    //                     cedula: 'V-00112233',
    //                     birthYear: 2015,
    //                     relationship: 'Hija',
    //                     photo: '../src/img/beneficiarios/beneficiario3.jpg'
    //                 },
    //             ];
    //             resolve({
    //                 ok: true,
    //                 json: () => Promise.resolve(dummyData.map(member => ({
    //                     ...member,
    //                     qrCodeData: generateQrCodeData(member.cedula, member.id) // Agrega el QR data a cada miembro
    //                 })))
    //             });
    //         }, 1000));

    //         if (!response.ok) {
    //             throw new Error('Error al cargar los beneficiarios. Código: ' + response.status);
    //         }
    //         const data = await response.json();
    //         setBeneficiaries(data);
    //     } catch (err) {
    //         console.error("Error fetching beneficiaries:", err);
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [userId]); // generateQrCodeData no es una dependencia porque sus dependencias son estáticas o ya están en userId

    // useEffect(() => {
    //     if (userId) {
    //         fetchBeneficiaries();
    //     }
    // }, [userId, fetchBeneficiaries]);

    const handleBackClick = () => {
        navigate('/perfil');
    };

    const handleAddMemberClick = () => {
        setDataBeneficiarioNuevo({
            id_familiar: '',
            id_usuario: userId,
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

    if (loading) return <LoadingModal visible='true'>Cargando...</LoadingModal>;

    if (error) {
        return (
            <div className="family-list-container">
                <div className="family-list-header">
                    <button className="back-button" onClick={handleBackClick}>←</button>
                    <h2>Error al Cargar Beneficiarios</h2>
                </div>
                <p style={{ textAlign: 'center', color: 'red', marginTop: '20px' }}>Ocurrió un error: {error}</p>
                <button className="add-member-button" onClick={fetchBeneficiaries} style={{ marginTop: '20px', backgroundColor: '#dc3545' }}>Reintentar</button>
            </div>
        );
    }

    return (
        <React.Fragment>
        <ConfirmarModal onConfirm={()=>handleConfirmacion(true)} onCancel={()=>handleConfirmacion(false)} visible={showConfirmarModal}></ConfirmarModal>
        <ExitosoModal visible={showExitosoModal}></ExitosoModal>
        <div className="family-list-container">
            <div className="family-list-header">
                <button className="back-button" onClick={handleBackClick}>←</button>
                <h2>Mis Beneficiarios</h2>
            </div>

            <div className="add-member-button-container">
                <button className="add-member-button" onClick={handleAddMemberClick}>
                    <i className='fas fa-user'></i> Agregar Nuevo
                </button>
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