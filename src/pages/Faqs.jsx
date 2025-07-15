import React, { useState } from 'react';
import '../css/Faqs.css';

const faqs = [
  {
    question: '¿Cómo puedo registrarme en la aplicación?',
    answer: 'Para registrarte, haz clic en el botón "Registrarse" en la pantalla principal y sigue los pasos indicados.'
  },
  {
    question: '¿Puedo usar la app sin conexión a internet?',
    answer: 'Algunas funciones están disponibles sin conexión, pero para acceder a todas necesitarás conexión a internet.'
  },
  {
    question: '¿Cómo contacto con soporte?',
    answer: 'Puedes escribirnos a soporte@tuapp.com y te responderemos lo antes posible.'
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className="faq-toggle">{isOpen ? '–' : '+'}</span>
      </button>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className="faq-container">
      <div className="faq-content">
        <h1 className="faq-title">Preguntas Frecuentes</h1>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
