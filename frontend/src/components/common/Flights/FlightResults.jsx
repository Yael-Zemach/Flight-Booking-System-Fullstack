import React from 'react';
import SingleFlight from './SingleFlight';
import '../../../style/Flights/FlightResults.css'; // ייבוא ה-CSS

const FlightResults = ({ results, selectedOutbound, selectedInbound, onSelectFlight }) => {
    const { isFlexible, outbound, inbound } = results;

    if (outbound.length === 0 && inbound.length === 0) {
        return <p className="no-results-msg">לא נמצאו טיסות מתאימות לתאריכים שנבחרו.</p>;
    }

    return (
        <div className="results-container">
            {isFlexible && (
                <div className="flexible-notice">
                    💡 מציג תוצאות מחיפוש תאריכים גמיש (יומיים קדימה/אחורה)
                </div>
            )}
            
            <div className="results-columns-wrapper">
                {/* טור טיסות הלוך */}
                <div className="results-column">
                    <h3 className="column-title-outbound">🛫 טיסות הלוך ({outbound.length})</h3>
                    {outbound.map(flight => (
                        <SingleFlight 
                            key={flight.flight_id} 
                            flight={flight}
                            onSelect={() => onSelectFlight(flight, 'outbound')}
                            isSelected={selectedOutbound?.flight_id === flight.flight_id}
                        />
                    ))}
                </div>

                {/* טור טיסות חזור */}
                {inbound && inbound.length > 0 && (
                    <div className="results-column">
                        <h3 className="column-title-inbound">🛬 טיסות חזור ({inbound.length})</h3>
                        {inbound.map(flight => (
                            <SingleFlight 
                                key={flight.flight_id} 
                                flight={flight}
                                onSelect={() => onSelectFlight(flight, 'inbound')}
                                isSelected={selectedInbound?.flight_id === flight.flight_id}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlightResults;