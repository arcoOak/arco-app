import './BuscadorTexto.css';

const BuscadorTexto = ({ searchTerm, setSearchTerm, placeholder }) => {
    return (
        <div className="search-categoria">
            <button>
                <i className='bx bx-search-big'></i>
            </button>
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default BuscadorTexto;
