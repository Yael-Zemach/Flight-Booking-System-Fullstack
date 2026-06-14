import React from 'react';

export default function FlightDatePicker({ 
    label, 
    value, 
    onChange, 
    type = 'date', 
    min, 
    name, 
    required = true,
    className = 'form-group' 
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