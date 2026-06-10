import React, { useState } from 'react';
import { UI_MESSAGES } from '../../../constants/messages.js';
import '../../../style/Bookings/PassengersForm.css';

export default function PassengersForm({ numberOfPassengers, onSubmit }) {
    const initialPassengers = Array.from({ length: numberOfPassengers }, () => ({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'male',
        email: '', 
        phone: ''  
    }));

    const [passengers, setPassengers] = useState(initialPassengers);
    const [error, setError] = useState('');

    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index][field] = value;
        setPassengers(updatedPassengers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const isValid = passengers.every(pax => 
            pax.first_name.trim() !== '' && 
            pax.last_name.trim() !== '' && 
            pax.date_of_birth !== '' &&
            pax.gender !== ''
        );

        if (!isValid) {
            setError(UI_MESSAGES.passengers.requiredFieldsError);
            return;
        }

        onSubmit(passengers);
    };

    return (
        <form onSubmit={handleSubmit} className="passengers-form">
            <h3 className="passengers-form-title">{UI_MESSAGES.passengers.title}</h3>
            {error && <div className="passengers-error">{error}</div>}

            {passengers.map((pax, index) => (
                <div key={index} className="passenger-card">
                    <h4 className="passenger-card-title">{UI_MESSAGES.passengers.passengerLabel} {index + 1}</h4>
                    
                    <div className="passenger-card-grid">
                        <div className="passenger-field">
                            <label className="passenger-field-label">{UI_MESSAGES.passengers.firstNameLabel}</label>
                            <input 
                                type="text" 
                                className="passenger-input"
                                value={pax.first_name}
                                onChange={(e) => handlePassengerChange(index, 'first_name', e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="passenger-field-group">
                            <label className="passenger-field-label">{UI_MESSAGES.passengers.lastNameLabel}</label>
                            <input 
                                type="text" 
                                className="passenger-input"
                                value={pax.last_name}
                                onChange={(e) => handlePassengerChange(index, 'last_name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="passenger-field-group">
                            <label className="passenger-field-label">{UI_MESSAGES.passengers.birthDateLabel}</label>
                            <input 
                                type="date" 
                                className="passenger-input"
                                value={pax.date_of_birth}
                                onChange={(e) => handlePassengerChange(index, 'date_of_birth', e.target.value)}
                                required
                                max={new Date().toISOString().split("T")[0]} 
                            />
                        </div>
                        
                        <div className="passenger-field-group">
                            <label className="passenger-field-label">{UI_MESSAGES.passengers.genderLabel}</label>
                            <select 
                                className="passenger-input"
                                value={pax.gender}
                                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            >
                                <option value="male">{UI_MESSAGES.passengers.genderMale}</option>
                                <option value="female">{UI_MESSAGES.passengers.genderFemale}</option>
                                <option value="other">{UI_MESSAGES.passengers.genderOther}</option>
                            </select>
                        </div>

                        <div className="passenger-field-group">
                            <label className="passenger-field-label">{UI_MESSAGES.passengers.emailLabel}</label>
                            <input 
                                type="email" 
                                className="passenger-input"
                                value={pax.email}
                                onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                            />
                        </div>
                        
                        <div className="passenger-field-group">
                            <label className="passenger-field-label">{UI_MESSAGES.passengers.phoneLabel}</label>
                            <input 
                                type="tel" 
                                className="passenger-input"
                                value={pax.phone}
                                onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button type="submit" className="passengers-submit-btn">
                {UI_MESSAGES.passengers.continueToPayment}
            </button>
        </form>
    );
}