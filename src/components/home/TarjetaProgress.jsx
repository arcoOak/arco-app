// Progress.jsx (updated)
import React from 'react';
import './TarjetaProgress.css';

import Button from '../buttons/Button';

const Progress = ({ percentage }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className='progress-section'>
            <div className="progress-container">
                <div className="progress-header">
                    <div className="progress-circle">
                        <svg className="progress-ring" width="100" height="100">
                            <circle
                                className="progress-ring-track"
                                stroke="#e6e6e6"
                                strokeWidth="6"
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                            />
                            <circle
                                className="progress-ring-bar"
                                stroke="#4070f4"
                                strokeWidth="6"
                                fill="transparent"
                                r={radius}
                                cx="50"
                                cy="50"
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: strokeDashoffset,
                                }}
                            />
                        </svg>
                        <span className="progress-percentage">{percentage}%</span>
                    </div>
                    <div className="progress-info">
                        <h3 className="progress-title">Puntos Acumulados</h3>
                        <p className="progress-description">Canjea tus Recompensas</p>

                        <Button className='primary'>
                            Canjear
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Progress;