
import React, { useMemo, useRef, useEffect } from 'react';

import { useDragToScroll } from '../hooks/useDragToScroll';

import './MesSelector.css'; // Asegúrate de tener un archivo CSS para estilos

const MesSelector = ({ mesSeleccionado, handleMesSeleccionado }) => {
    const monthsRef = useRef({});

    const { scrollContainerRef, dragHandlers } = useDragToScroll();

    useEffect(() => {
                        const selectedMonthElement = monthsRef.current[mesSeleccionado];
                
                        if (selectedMonthElement) {
                            selectedMonthElement.scrollIntoView({
                                behavior: 'smooth', // Para una animación suave
                                inline: 'center',  // Centra el elemento horizontalmente
                                block: 'nearest'   // Evita el scroll vertical innecesario
                            });
                        }
                    }, [mesSeleccionado]);

    const listaMeses = useMemo(() => {
                    return [
                        {
                            nombre: 'Enero',
                            numero: 1
                        },
                        {
                            nombre: 'Febrero',
                            numero: 2
                        },
                        {
                            nombre: 'Marzo',
                            numero: 3
                        },
                        {
                            nombre: 'Abril',
                            numero: 4
                        },
                        {
                            nombre: 'Mayo',
                            numero: 5
                        },
                        {
                            nombre: 'Junio',
                            numero: 6
                        },
                        {
                            nombre: 'Julio',
                            numero: 7
                        },
                        {
                            nombre: 'Agosto',
                            numero: 8
                        },
                        {
                            nombre: 'Septiembre',
                            numero: 9
                        },
                        {
                            nombre: 'Octubre',
                            numero: 10
                        },
                        {
                            nombre: 'Noviembre',
                            numero: 11
                        },
                        {
                            nombre: 'Diciembre',
                            numero: 12
                        }
                    ];
                }, []);



    return (
        <div className="meses-list" ref={scrollContainerRef} {...dragHandlers}>
                <div className="meses-list-inner">
                    { listaMeses.map((mes) => (
                        <div 
                            className={`meses-item ${mesSeleccionado == mes.numero ? 'active' : ''}`} 
                            key={mes.numero} 
                            ref = { (element) => monthsRef.current[mes.numero] = element }
                            onClick={() => handleMesSeleccionado(mes.numero)}
                        >
                            <p className="meses-item-nombre">{mes.nombre}</p>
                        </div>
                    ))
                    }

                </div>
        </div>
    );
}


export default MesSelector;