import './CategoriaSelector.css';

const CategoriaSelector = ({scrollContainerRef, dragHandlers, displayCategorias, activeCategory, handleSeleccionarCategoria, id, nombre}) => {
    return (
        <div
            className="categorias"
            ref={scrollContainerRef}
            {...dragHandlers}
        >
            {displayCategorias.map((cat) => (
                <button
                    key={cat[`${id}`]}
                    className={`span-categoria ${activeCategory === cat[`${id}`] ? 'active' : ''}`}
                    onClick={() => handleSeleccionarCategoria(cat[`${id}`])}
                >
                    <i className={`fa ${cat.icon_fa}`}></i> {cat[`${nombre}`]}
                </button>
            ))}
            </div>
    )
}

export default CategoriaSelector;