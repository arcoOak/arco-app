import { useState } from "react";

export default function Perfil() {
    const [activeDiv, setActiveDiv] = useState(0);

    const handleDivClick = (index) => {
        if (activeDiv === index) {
            setActiveDiv(0); // Collapse the div if it's already active
            return;
        }
        setActiveDiv(index);
    };
    return (
        <div className="container-fluid">
            <div className="row mb-4 mt-4" >
                <div className="col-md-12">
                    <div className="profile-photo-container">
                        <img src="./src/img/perfil.jpg" alt="" className="profile-photo" />
                    </div>
                    <h2 className="mb-2">Johny Roria</h2>
                    <span className="profile-mail">Acción: 574</span>
                </div>
            </div >

            <div className="row mb-p">
                <div className="col-md-12">
                    <div className="profile-info">

                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Nombre y Apellido</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0' }}
                                    >
                                        <label><i class='bx bx-user-square'></i> Johny Roria</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Cédula</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0' }}
                                    >
                                        <label><i class='bx bx-user-id-card'></i> V25.632.154</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Teléfono</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0' }}
                                    >
                                        <label><i class='bx bx-phone'></i> +51 987654321</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Dirección</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0' }}
                                    >
                                        <label><i class='bx bx-location'></i> Venezuela, Caracas</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Fecha de Nacimiento</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0' }}
                                    >
                                        <label><i class='bx bx-calendar-alt'></i>  01/01/2000</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="faqs">
                                <div className={`${activeDiv === 1 ? 'active' : ''} faq`} onClick={() => handleDivClick(1)}>
                                    <div className="head">
                                        <span className="label-info">Carga Familiar</span>
                                        <svg
                                            width={18}
                                            height={19}
                                            viewBox="0 0 18 19"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9 14.469L1 6.46897L1.96897 5.5L9 12.531L16.031 5.5L17 6.46897L9 14.469Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="content"
                                        style={{ height: activeDiv === 1 ? 'auto' : '0' }}
                                    >
                                        <label><i class='bx bx-parent-child'></i> 4 Hijos</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="info-item b-0 mt-2 py-3">
                            <span className="label-info pass">Cambiar Clave</span>
                            <span className="value"><i class='bx bx-lock-keyhole pass'></i></span>
                        </div>
                        <div className="info-item b-0 py-3">
                            <span className="label-info exit">Cerrar Sesión</span>
                            <span className="value"><i class='bx bx-arrow-in-right-square-half exit'></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
