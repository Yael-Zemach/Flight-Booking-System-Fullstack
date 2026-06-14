import React from 'react';
import AdminAirportRow from './Airports/AdminAirportRow.jsx';

export default function AdminAirportsTable({ airports, onDelete, onUpdateImage, loading }) {
    return (
        <section className="table-section-scrollable">
            <h4>📋 רשימת שדות התעופה הקיימים במערכת</h4>

            {loading && <p className="loading-message">טוען נתונים...</p>}
            
            {!loading && airports.length === 0 ? (
                <p className="loading-message">לא נמצאו שדות תעופה רשומים.</p>
            ) : (
                // חלון הגלילה האנכי היחיד שקיים במסך
                <div className="flights-table-wrapper">
                    <div className="airport-cards-container">
                        {airports.map(airport => (
                            <AdminAirportRow 
                                key={airport.airport_id}
                                airport={airport}
                                onDelete={onDelete}
                                onUpdateImage={onUpdateImage}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}