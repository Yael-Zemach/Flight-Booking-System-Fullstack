import React from 'react';
import AdminFlightRow from './AdminFlightRow.jsx';

export default function AdminFlightsTable({ flights, editingFlightId, onStartEdit, onCancelFlight, filterDate, onFilterDateChange, loading }) {
    return (
        <section className="table-section-scrollable">
            <div className="table-controls-header">
                <h3>לוח טיסות לתאריך נבחר</h3>
                <div className="date-filter-group">
                    <label>הצג טיסות מתאריך:</label>
                    <input 
                        type="date" 
                        value={filterDate} 
                        onChange={(e) => onFilterDateChange(e.target.value)}
                    />
                </div>
            </div>

            {loading && <p className="loading-text">טוען נתוני טיסות לתאריך זה...</p>}
            
            {!loading && flights.length === 0 ? (
                <p className="no-flights-text">אין טיסות מתוכננות בתאריך {filterDate}.</p>
            ) : (
                <div className="flights-table-overflow-wrapper">
                    <table className="flights-table">
                        <thead>
                            <tr>
                                <th>מספר טיסה</th>
                                <th>מוצא ⬅️ יעד</th>
                                <th>זמן המראה</th>
                                <th>מחיר</th>
                                <th>מושבים פנויים</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map(flight => (
                                <AdminFlightRow 
                                    key={flight.flight_id}
                                    flight={flight}
                                    isEditing={editingFlightId === flight.flight_id}
                                    onStartEdit={onStartEdit}
                                    onCancelFlight={onCancelFlight}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}