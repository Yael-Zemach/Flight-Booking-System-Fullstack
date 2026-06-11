import React from 'react';

export default function FlightDatePicker({ 
    label, 
    value, 
    onChange, 
    type = 'date', // ברירת מחדל היא תאריך רגיל, האדמין יעביר 'datetime-local'
    min, 
    name, 
    required = true,
    className = 'form-group' // מאפשר להעביר קלאס עוטף בהתאם לעיצוב הדף (הטופס של הלקוח או האדמין)
}) {
    return (
        <div className={className}>
            <label>{label}</label>
            <input 
                type={type} 
                name={name}
                value={value}
                onChange={onChange}
                min={min}
                required={required}
            />
        </div>
    );
}