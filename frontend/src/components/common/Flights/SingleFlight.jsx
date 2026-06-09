import React from 'react';
import '../../../style/Flights/SingleFlight.css'; // ייבוא ה-CSS


const SingleFlight = ({ flight, onSelect, isSelected }) => {
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
    };

    return (
        <div className={`flight-card ${isSelected ? 'selected' : ''}`}>
            <div>
                <span className="flight-badge">{flight.flight_number}</span>
                <span className="flight-route">{flight.departure_code} ({flight.departure_city})</span> 
                <span className="flight-arrow">⬅️</span>
                <span className="flight-route">{flight.arrival_code} ({flight.arrival_city})</span>
                
                <div className="flight-times">
                    יציאה: {formatDate(flight.departure_time)} בשעה {formatTime(flight.departure_time)} | 
                    נחיתה: {formatTime(flight.arrival_time)}
                </div>
            </div>

            <div className="flight-price-zone">
                <div className="flight-price">{flight.price}$</div>
                
                {/* הנה התוספת שביקשת למשתמש קצה */}
                
                <div className="flight-seats">נשארו {flight.seats_available} מושבים</div>
                
                <button 
                    type="button"
                    onClick={onSelect}
                    className={`select-flight-btn ${isSelected ? 'active' : ''}`}
                >
                    {isSelected ? '✓ נבחרה' : 'בחר טיסה'}
                </button>
            </div>
        </div>
    );
};

export default SingleFlight;