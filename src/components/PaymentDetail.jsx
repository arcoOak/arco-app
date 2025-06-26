// src/components/PaymentDetail.jsx
import React, { useState } from 'react'; // Importa useState
import { useParams, useNavigate } from 'react-router-dom';
import '../css/PaymentDetail.css';

const PaymentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // En una aplicación real, obtendrías estos datos de una API.
    // Para este ejemplo, usamos los mismos datos dummy, asegurándonos
    // de que algunos tengan 'debth' para probar el formulario.
    const paymentDetailsData = [
        {
            id: 1,
            category: 'Junio', // Cambiado a Junio para que sea el pendiente de la imagen
            date: '05/06/2025',
            time: '', // No hay hora si está pendiente
            amount: 55,
            reference: '',
            capture: '',
            concept: 'Pago de condominio mes Junio',
            statPay: 'debth' // Este es el que estará pendiente
        },
        {
            id: 2,
            category: 'Abril',
            date: '05/04/2025',
            time: '02:15 PM',
            amount: 50,
            reference: 'REF-002',
            capture: '../src/img/recibos/recibo.jpg',
            concept: 'Pago de condominio mes Abril',
            statPay: 'paid'
        },
        {
            id: 3,
            category: 'Marzo',
            date: '05/03/2025',
            time: '09:00 AM',
            amount: 45,
            reference: 'REF-003',
            capture: '../src/img/recibos/recibo.jpg',
            concept: 'Pago de condominio mes Marzo',
            statPay: 'paid'
        },
        {
            id: 4,
            category: 'Febrero',
            date: '05/02/2025',
            time: '04:45 PM',
            amount: 43,
            reference: 'REF-004',
            capture: '../src/img/recibos/recibo.jpg',
            concept: 'Pago de condominio mes Febrero',
            statPay: 'paid'
        },
        {
            id: 5,
            category: 'Enero',
            date: '05/01/2025',
            time: '11:00 AM',
            amount: 40,
            reference: 'REF-005',
            capture: '../src/img/recibos/recibo.jpg',
            concept: 'Pago de condominio mes Enero',
            statPay: 'paid'
        },
    ];

    const payment = paymentDetailsData.find(p => p.id === parseInt(id));

    // Nuevo estado para controlar la visibilidad del formulario
    const [showReportForm, setShowReportForm] = useState(false);
    // Nuevo estado para los datos del formulario
    const [formData, setFormData] = useState({
        paymentMonto: '',
        paymentDate: '',
        paymentTime: '',
        referenceNumber: '',
        // file: null // Para la captura, manejaremos esto por separado
    });
    // Estado para el archivo de captura
    const [selectedFile, setSelectedFile] = useState(null);


    if (!payment) {
        return (
            <div className="payment-detail-container">
                <h2>Detalle del Pago no encontrado</h2>
                <button className="back-button" onClick={() => navigate('/')}>Volver al Historial</button>
            </div>
        );
    }

    // Función para manejar el cambio en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Función para manejar la selección del archivo
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Función para manejar el envío del formulario
    const handleSubmitReport = (e) => {
        e.preventDefault();
        // Aquí es donde enviarías los datos del reporte de pago a tu backend.
        // Incluirías formData y selectedFile.

        console.log('Reporte de pago enviado:', {
            paymentId: payment.id,
            ...formData,
            fileName: selectedFile ? selectedFile.name : 'No file'
        });

        // Simular un envío exitoso
        alert('Reporte de pago enviado con éxito. Pendiente de verificación.');

        // Opcional: Redirigir al usuario o actualizar el estado del pago
        // Por ejemplo, podrías volver a la pantalla principal o mostrar un mensaje de confirmación.
        navigate('/'); // Redirige a la página principal después de enviar
    };

    return (
        <div className="payment-detail-container">
            <button className="back-button" onClick={() => navigate('/')}>&larr; Volver</button>
            <div className="detail-header">
                <h2>Detalle de Pago</h2>
            </div>
            <div className="detail-card">
                <p><strong>Mes:</strong> {payment.category}</p>
                <p><strong>Fecha de Vencimiento:</strong> {payment.date}</p>
                {/* La hora y referencia solo se muestran si ya está pagado */}
                {payment.statPay === 'paid' && (
                    <>
                        <p><strong>Hora de Pago:</strong> {payment.time}</p>
                        <p><strong>Referencia:</strong> {payment.reference}</p>
                    </>
                )}
                <p><strong>Monto:</strong> ${payment.amount.toFixed(2)}</p>
                <p><strong>Concepto:</strong> {payment.concept}</p>
                {payment.capture && (
                    <div className="capture-section">
                        <p><strong>Comprobante:</strong></p>
                        <img src={`/images/${payment.capture}`} alt="Comprobante de Pago" className="payment-capture" />
                    </div>
                )}
                <p className={`payment-status ${payment.statPay === 'paid' ? 'status-paid' : 'status-pending'}`}>
                    Estado: {payment.statPay === 'paid' ? 'Pagado' : 'Pendiente'}
                </p>

                {/* Mostrar el botón "Reportar Pago" solo si el estado es 'pendiente' */}
                {payment.statPay === 'debth' && (
                    <button className="report-payment-button" onClick={() => setShowReportForm(!showReportForm)}>
                        {showReportForm ? 'Cancelar Reporte' : 'Reportar Pago'}
                    </button>
                )}

                {/* Formulario para reportar el pago, visible solo si showReportForm es true */}
                {showReportForm && payment.statPay === 'debth' && (
                    <form className="report-form" onSubmit={handleSubmitReport}>
                        <h3>Reportar Pago de {payment.category}</h3>
                        <div className="form-group">
                            <label htmlFor="paymentDate">Monto:</label>
                            <input
                                type="text"
                                id="paymentMonto"
                                name="paymentMonto"
                                value={formData.paymentMonto}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="paymentDate">Fecha de Pago:</label>
                            <input
                                type="date"
                                id="paymentDate"
                                name="paymentDate"
                                value={formData.paymentDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="paymentTime">Hora de Pago:</label>
                            <input
                                type="time"
                                id="paymentTime"
                                name="paymentTime"
                                value={formData.paymentTime}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="referenceNumber">Número de Referencia/Transacción:</label>
                            <input
                                type="text"
                                id="referenceNumber"
                                name="referenceNumber"
                                value={formData.referenceNumber}
                                onChange={handleChange}
                                placeholder="Ej: 1234567890"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="captureFile">Comprobante de Pago (Captura/Foto):</label>
                            <input
                                type="file"
                                id="captureFile"
                                name="captureFile"
                                accept="image/*" // Solo permite imágenes
                                onChange={handleFileChange}
                                required
                            />
                            {selectedFile && <p className="selected-file-name">Archivo seleccionado: {selectedFile.name}</p>}
                        </div>
                        <button type="submit" className="submit-report-button">Enviar Reporte</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PaymentDetail;