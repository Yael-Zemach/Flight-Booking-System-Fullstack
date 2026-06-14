import React, { useState, useEffect } from 'react';
import { UI_MESSAGES } from '../../../constants/messages.js';
import AirportAutocomplete from './AirportAutocomplete.jsx';
import FlightDatePicker from './FlightDatePicker.jsx'; // 🌟 ייבוא רכיב התאריך המשותף
import '../../../style/Flights/SearchForm.css';

const SearchForm = ({ airports, onSearch, prefilledDestination }) => {
    const [tripType, setTripType] = useState('round-trip'); 
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);

    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');

    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
    if (airports && airports.length > 0 && prefilledDestination) {
        const destAirport = airports.find(ap => ap.city === prefilledDestination);
        
        if (destAirport) {
            
            if (destAirport.airport_code === 'TLV') {
                setDest('TLV');
                setOrigin(''); 
            } else {
                setDest(destAirport.airport_code);
                setOrigin('TLV');
            }
        }
    }
}, [airports, prefilledDestination]);

    const getAvailableDestinations = () => {
        if (!origin) return airports;
        if (origin === 'TLV') {
            return airports.filter(ap => ap.airport_code !== 'TLV');
        } else {
            return airports.filter(ap => ap.airport_code === 'TLV');
        }
    };

    const handleDepartDateChange = (e) => {
        const newDepartDate = e.target.value;
        setDepartDate(newDepartDate);
        if (returnDate && newDepartDate > returnDate) setReturnDate('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!origin || !dest || !departDate) {
            alert(UI_MESSAGES.search.requiredFieldsAlert);
            return;
        }
        if (tripType === 'round-trip' && !returnDate) {
            alert(UI_MESSAGES.search.returnDateAlert);
            return;
        }
        onSearch({ tripType, origin, dest, departDate, returnDate, passengers });
    };

    return (
        <form onSubmit={handleSubmit} className="search-form-container">
            <div className="trip-type-selector">
                <button type="button" onClick={() => setTripType('round-trip')} className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`}>
                    {UI_MESSAGES.search.tripTypes.roundTrip}
                </button>
                <button type="button" onClick={() => setTripType('one-way')} className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}>
                    {UI_MESSAGES.search.tripTypes.oneWay}
                </button>
            </div>

            <div className="form-inputs-grid">
                <AirportAutocomplete 
                    airports={airports} value={origin} idKey="airport_code"
                    label={UI_MESSAGES.search.originLabel} placeholder={UI_MESSAGES.search.originPlaceholder}
                    onChange={(ap) => {
                        if (ap) {
                            setOrigin(ap.airport_code);
                            if (ap.airport_code !== 'TLV') setDest('TLV');
                        } else {
                            setOrigin(''); setDest('');
                        }
                    }}
                />

                <AirportAutocomplete 
                    airports={getAvailableDestinations()} value={dest} idKey="airport_code"
                    label={UI_MESSAGES.search.destinationLabel} placeholder={UI_MESSAGES.search.originPlaceholder}
                    disabled={origin && origin !== 'TLV'}
                    onChange={(ap) => setDest(ap ? ap.airport_code : '')}
                />

                {/* 🌟 שימוש ברכיב המשותף עבור תאריך יציאה */}
                <FlightDatePicker 
                    label={UI_MESSAGES.search.departDateLabel}
                    value={departDate}
                    onChange={handleDepartDateChange}
                    min={todayStr}
                    className="form-field-group" // שומר על ה-class המקורי של טופס הלקוח
                />

                {/* 🌟 שימוש ברכיב המשותף עבור תאריך חזרה */}
                {tripType === 'round-trip' && (
                    <FlightDatePicker 
                        label={UI_MESSAGES.search.returnDateLabel}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departDate || todayStr}
                        className="form-field-group"
                    />
                )}

                <div className="form-field-group">
                    <label>{UI_MESSAGES.search.passengersLabel}</label>
                    <input type="number" min="1" max="9" value={passengers} onChange={(e) => setPassengers(e.target.value)} className="form-input-passengers" />
                </div>

                <button type="submit" className="search-submit-btn">
                    {UI_MESSAGES.search.searchButton}
                </button>
            </div>
        </form>
    );
};

export default SearchForm;