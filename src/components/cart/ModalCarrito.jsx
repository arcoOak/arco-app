import './ModalCarrito.css'

const ModalCarrito = ({ visible, cantidad, onPress }) => {

    const handleClick = () => {
        onPress();
    };

    return (
        ( visible &&
        <button className="carrito-flotante" onClick={() => handleClick()}>
            <i className='fa fa-shopping-cart'></i>
            <span className="carrito-contador">{cantidad}</span>
        </button>
        )
    )
}

export default ModalCarrito;