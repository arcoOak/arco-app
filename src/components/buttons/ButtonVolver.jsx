import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ButtonVolver.css';

/**
 * Un botón reutilizable que navega a una ruta específica.
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.to - La ruta a la que navegar.
 * @param {React.ReactNode} [props.children='Volver'] - El contenido del botón.
 * @param {string} [props.className] - Clases CSS adicionales para el botón.
 */
const BotonVolver = ({ to, className }) => {
    const navigate = useNavigate();

    const buttonClassName = `btn btn-primary boton-volver ${className || ''}`.trim();

    return (
        <button className={buttonClassName} onClick={() => navigate(to)}>
            <i className="fa-solid fa-circle-arrow-left"></i> 
            <p>Volver</p>
        </button>
    );
};

BotonVolver.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
};

export default BotonVolver;

