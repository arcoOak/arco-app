import './ModalNotificaciones.css'

const ModalNotificaciones = ({ visible, onPress, cantidadNoVistas }) => {

    const handleClick = () => {
        onPress();
    };

    return (
        ( visible &&
        <button className={`notificaciones-flotante ${cantidadNoVistas > 0 ? 'tiene-notificaciones' : ''}`} onClick={() => handleClick()}>
            <i className="fa-solid fa-bell"></i>
        </button>
        )
    )
}

export default ModalNotificaciones;