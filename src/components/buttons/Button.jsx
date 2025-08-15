import './Button.css';

const Button = ({ children, onClick, type = 'button', className = 'primary', disabled = false }) => {
  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;