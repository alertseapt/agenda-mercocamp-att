import React, { useState, useEffect } from 'react';
import './DateInputModal.css';

const DateInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [dateValue, setDateValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDateValue(''); // Limpa o campo sempre que o modal abrir
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setDateValue(e.target.value);
  };

  const handleSubmit = () => {
    if (dateValue) {
      const newDate = new Date(dateValue);
      if (!isNaN(newDate.getTime())) {
        onSubmit(newDate.toISOString());
        onClose();
        return;
      }
    }
    alert('Por favor, selecione uma data válida.');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="date-input-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="date-input-modal-content">
        <h3>Alterar Data de Agendamento</h3>
        <p>Selecione a nova data.</p>
        <input
          type="date"
          value={dateValue}
          onChange={handleInputChange}
          className="date-input-field"
        />
        <div className="date-input-modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSubmit} className="btn-primary">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default DateInputModal; 