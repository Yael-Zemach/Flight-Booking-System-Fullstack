import React from 'react';

export default function AdminFlightRow({ flight, isEditing, onStartEdit, onCancelFlight }) {
    const flightTime = new Date(flight.departure_time).toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });

    return (
        <tr className={isEditing ? 'row-editing' : ''}>
            <td className="flight-number-cell"><strong>{flight.flight_number}</strong></td>
            <td>
                <div className="airport-route-display">
                    <span className="airport-origin-code">{flight.departure_code || flight.departure_city}</span>
                    <span className="route-arrow">⬅️</span>
                    <span className="airport-destination-code">{flight.arrival_code || flight.arrival_city}</span>
                </div>
            </td>
            <td>{flightTime}</td>
            <td>${flight.price}</td>
            <td>{flight.seats_available}</td>
            <td>
                <span className={`status-badge ${flight.status}`}>
                    {flight.status === 'scheduled' ? '🟢 פעילה' : '🔴 מבוטלת'}
                </span>
            </td>
            <td>
                <div className="table-actions-container">
                    {flight.status !== 'cancelled' && (
                        <button className="edit-btn" onClick={() => onStartEdit(flight)}>
                            ✏️ ערוך
                        </button>
                    )}
                    <button 
                        className="cancel-btn"
                        onClick={() => onCancelFlight(flight.flight_id)}
                        disabled={flight.status === 'cancelled'}
                    >
                        🛑 בטל
                    </button>
                </div>
            </td>
        </tr>
    );
}