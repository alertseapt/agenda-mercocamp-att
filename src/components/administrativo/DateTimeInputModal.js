import React, { useState, useEffect } from 'react';
import './DateTimeInputModal.css';

const DateTimeInputModal = ({ isOpen, onClose, onSubmit, initialDateTimeString }) => {
  const [dateValue, setDateValue] = useState('');
  const [timeStr, setTimeStr] = useState('');

  // Converte DD/MM/AA para YYYY-MM-DD para o input de data
  const toInputDate = (d) => {
    if (!d) return '';
    const parts = d.split('/');
    if (parts.length !== 3) return '';
    
    let year = parts[2];
    if (year.length === 2) {
      year = `20${year}`;
    }
    
    return `${year}-${parts[1]}-${parts[0]}`;
  };

  // Converte YYYY-MM-DD para DD/MM/AA para o estado interno
  const fromInputDate = (d) => {
    if (!d) return '';
    const parts = d.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}/${parts[1]}/${parts[0].slice(-2)}`;
  };

  useEffect(() => {
    if (isOpen) {
      const [initialDate, initialTime] = (initialDateTimeString || '').split(' ');
      setDateValue(toInputDate(initialDate));
      setTimeStr(initialTime || '');
    }
  }, [initialDateTimeString, isOpen]);

  const handleDateInputChange = (e) => {
    setDateValue(e.target.value);
  };

  const handleTimeInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
    setTimeStr(value);
  };
  
  const handleSubmit = () => {
    const dateStr = fromInputDate(dateValue);
    const dateMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
    const timeMatch = timeStr.match(/^(\d{2}):(\d{2})$/);

    if (dateMatch && timeMatch) {
      const [, day, month, year] = dateMatch.map(Number);
      const [, hours, minutes] = timeMatch.map(Number);
      const fullYear = 2000 + year;
      
      const newDate = new Date(Date.UTC(fullYear, month - 1, day, hours, minutes));

      if (!isNaN(newDate.getTime())) {
        onSubmit(newDate.toISOString());
        onClose();
        return;
      }
    }
    
    alert('Formato de data ou hora inválido.');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="datetime-input-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="datetime-input-modal-content">
        <h3>Alterar Data e Hora</h3>
        <p>Insira a nova data e hora.</p>
        <div className="datetime-input-container">
          <input
            type="date"
            value={dateValue}
            onChange={handleDateInputChange}
            className="datetime-input-field date"
          />
          <input
            type="text"
            value={timeStr}
            onChange={handleTimeInputChange}
            placeholder="HH:MM"
            maxLength="5"
            className="datetime-input-field time"
          />
        </div>
        <div className="datetime-input-modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSubmit} className="btn-primary">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeInputModal; 