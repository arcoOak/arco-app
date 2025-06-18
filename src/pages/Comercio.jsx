export default function Comercio() {
    return (
        <div className="container-fluid">
            <h2 className="mt-2 mb-3">Tiendas Disponibles</h2>
            <div className="row">
                <div className="col-md-12">
                    <div className="categorias">
                        <span className="span-categoria">
                            <i class='bx bx-burger-alt'></i> Comida
                        </span>
                        <span className="span-categoria">
                            <i class='bx bx-coffee-cup'></i> Cafetería
                        </span>
                        <span className="span-categoria">
                            <i class='bx bx-icecream'></i> Heladería
                        </span>
                    </div>
                    <div className="search-categoria">
                        <button>
                            <i class='bx bx-search-big absolute'></i>
                        </button>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Busca la tienda que necesitas"
                        />
                    </div>
                    <div className="comercios">
                        <div className="comercio-card">
                            <img src="src/img/comercios/burguer-king.jpg" alt="Comercio" />
                            <h3>Burguer King</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/kfc.png" alt="Comercio" />
                            <h3>KFC</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/burguer-shack.jpg" alt="Comercio" />
                            <h3>Burguer Shack</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/mcdonald.png" alt="Comercio" />
                            <h3>McDonald's</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/dominos.png" alt="Comercio" />
                            <h3>Domino's</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/abruzzo.jpg" alt="Comercio" />
                            <h3>Abruzzo's</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/arturos.png" alt="Comercio" />
                            <h3>Arturos</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/bonsai.png" alt="Comercio" />
                            <h3>Bonsai Sushi</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/kfc.png" alt="Comercio" />
                            <h3>KFC</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                        <div className="comercio-card">
                            <img src="src/img/comercios/kfc.png" alt="Comercio" />
                            <h3>KFC</h3>
                            <p>Descripción breve del comercio.</p>
                            <button className="btn btn-primary">Ver más</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
