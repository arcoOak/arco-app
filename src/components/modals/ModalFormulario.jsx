import {React, useState} from 'react';
import './ModalFormulario.css'; // Asegúrate de que la ruta sea correcta

const ModalFormulario = ({ onClose, onSubmit, titulo, visible, children }) => {
    const [formData, setFormData] = useState({});   
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }       
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            onSubmit(formData);
            setFormData({});
            setIsSubmitting(false);
            onClose();
        } else {
            setErrors(errors);
            setIsSubmitting(false);
        }
    };


    return (
        <div className={`modal-overlay`} style={{ display: visible ? 'block' : 'none' }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{titulo}
                        </h2>
                        <button className="modal-close-button" onClick={onClose}>
                            X
                        </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="modal-submit-button" onClick={onSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Guardar...' : 'Guardar'}
                    </button>
                    <button className="modal-close-button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
            )

};

export default ModalFormulario;