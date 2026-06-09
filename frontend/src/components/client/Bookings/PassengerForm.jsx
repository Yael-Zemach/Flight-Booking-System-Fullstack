import React, { useState } from 'react';
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
            setError('נא למלא את כל שדות החובה (שם פרטי, שם משפחה, תאריך לידה ומין) עבור כל הנוסעים.');
            return;
        }

        onSubmit(passengers);
    };

    return (
        <form onSubmit={handleSubmit} className="passengers-form">
            <h3 className="passengers-form-title">פרטי נוסעים</h3>
            {error && <div className="passengers-error">{error}</div>}

            {passengers.map((pax, index) => (
                <div key={index} className="passenger-card">
                    <h4 className="passenger-card-title">נוסע {index + 1}</h4>
                    
                    <div className="passenger-card-grid">
                        <div className="passenger-field">
                            <label className="passenger-field-label">שם פרטי *</label>
                            <input 
                                type="text" 
                                className="passenger-input"
                                value={pax.first_name}
                                onChange={(e) => handlePassengerChange(index, 'first_name', e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="passenger-field-group">
                            <label className="passenger-field-label">שם משפחה *</label>
                            <input 
                                type="text" 
                                className="passenger-input"
                                value={pax.last_name}
                                onChange={(e) => handlePassengerChange(index, 'last_name', e.target.value)}
                                required
                            />
                        </div>

                        <div className="passenger-field-group">
                            <label className="passenger-field-label">תאריך לידה *</label>
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
                            <label className="passenger-field-label">מין *</label>
                            <select 
                                className="passenger-input"
                                value={pax.gender}
                                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                            >
                                <option value="male">זכר</option>
                                <option value="female">נקבה</option>
                                <option value="other">אחר</option>
                            </select>
                        </div>

                        <div className="passenger-field-group">
                            <label className="passenger-field-label">אימייל (אופציונלי)</label>
                            <input 
                                type="email" 
                                className="passenger-input"
                                value={pax.email}
                                onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                            />
                        </div>
                        
                        <div className="passenger-field-group">
                            <label className="passenger-field-label">מספר טלפון (אופציונלי)</label>
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
                המשך לשלב התשלום
            </button>
        </form>
    );
}