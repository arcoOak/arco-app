import React, {useState, useEffect} from 'react';
import './ModalFormulario.css'; // Asegúrate de que la ruta sea correcta

import ValidadorFormularios from '../../utils/ValidadorFormularios'; // Asegúrate de que la ruta sea correcta

const ModalFormulario = ({ onClose, onSubmit, titulo, visible, children, data }) => {
    const [formData, setFormData] = useState(data);   
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        
    }, [visible]);

    useEffect(() => {

            if (visible) {
                setFormData({});
                setErrors({});
                setIsSubmitting(false);
            
                const newData = {};
                React.Children.forEach(children, child => {
                    if (React.isValidElement(child) && child.props.name) {
                        newData[child.props.name] = '';
                    }
                });
            }
        
    }, [visible, children]);

         
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const errors = ValidadorFormularios(formData);
        
        if (Object.keys(errors).length === 0) {
            onSubmit(formData);
            setFormData({});
            setIsSubmitting(false);
            onClose();
        } else {
            setErrors(errors);
            setIsSubmitting(false);

            renderErrors();
        }
    };

    const renderErrors = () => {
        return Object.keys(errors).length > 0 ? (
            <div className="error-messages">
                {Object.entries(errors).map(([key, message]) => (
                    <div key={key} className="error-message">
                        {message}
                    </div>
                ))}
            </div>
        ) : null;
    };

    const handleClose = () => {

        setErrors({});
        setIsSubmitting(false);
        setFormData({});
        onClose();
    }

    



    return (
        <div className={`modal-overlay`} style={{ display: visible ? 'block' : 'none' }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{titulo}
                        </h2>
                        <button className="modal-close-button" onClick={handleClose}>
                            X
                        </button>
                </div>
                <form className="modal-body">
                    <div className='box-form-container'>
                    {children}
                    </div>
                </form>
                <div className="modal-footer">
                    <button className="modal-submit-button" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Guardar...' : 'Guardar'}
                    </button>
                    <button className="modal-close-button" onClick={handleClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
            )

};

export default ModalFormulario;