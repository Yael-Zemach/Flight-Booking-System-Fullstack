import React, { useState, useEffect } from 'react';
import { flightsApi } from '../../API/flightsAPI.js'; //  מתוקן!
import {getAllAirports} from '../../API/airportsAPI.js';
import SearchForm from '../../components/common/Flights/searchForm';
import FlightResults from '../../components/common/flights/FlightResults';
import { useNavigate } from 'react-router-dom';
import '../../style/Flights/FlightSearchPage.css';

const FlightSearchPage = () => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [selectedInbound, setSelectedInbound] = useState(null);
    const [currentTripType, setCurrentTripType] = useState('round-trip');
    const [searchPassengers, setSearchPassengers] = useState(1);

    // 1. טעינת שדות התעופה בטעינה הראשונית באמצעות ה-API החדש
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                // 🌟 שימוש בפונקציה הייעודית והנקייה שלך!
                const data = await getAllAirports();
                setAirports(data);
            } catch (err) {
                console.error('Airport Fetch Error:', err);
                setError(err.message);
            }
        };
        fetchAirports();
    }, []);

    // 2. שליחת טופס החיפוש לשרת
    const handleSearchSubmit = async (formData) => {
        setLoading(true);
        setError(null);
        setSearchResults(null);
        setSelectedOutbound(null);
        setSelectedInbound(null);
        
        setCurrentTripType(formData.tripType);
        setSearchPassengers(Number(formData.passengers));

        try {
            // בניית אובייקט פרמטרים נקי
            const searchParams = {
                tripType: formData.tripType,
                origin: formData.origin,
                dest: formData.dest,
                departDate: formData.departDate,
                passengers: formData.passengers
            };

            // הוספת תאריך חזור רק במידה וזו טיסת הלוך-חזור
            if (formData.tripType === 'round-trip') {
                searchParams.returnDate = formData.returnDate;
            }

            // קריאה ישירה ואלגנטית לשירות הטיסות שלך
            const data = await flightsApi.searchFlights(searchParams);
            setSearchResults(data); 
        } catch (err) {
            console.error('Search Flights Error:', err);
            // תופס אבסולוטית את ה-errorMessage שחזר מהקונטרולר בשרת
          setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFlight = (flight, direction) => {
        if (direction === 'outbound') {
            setSelectedOutbound(selectedOutbound?.flight_id === flight.flight_id ? null : flight);
        } else {
            setSelectedInbound(selectedInbound?.flight_id === flight.flight_id ? null : flight);
        }
    };

    const isSelectionComplete = () => {
        if (currentTripType === 'one-way') return selectedOutbound !== null;
        return selectedOutbound !== null && selectedInbound !== null;
    };

    const calculateTotal = () => {
        const outboundPrice = selectedOutbound?.price ? parseFloat(selectedOutbound.price) : 0;
        const inboundPrice = selectedInbound?.price ? parseFloat(selectedInbound.price) : 0;
        return (outboundPrice + inboundPrice) * searchPassengers;
    };

    return (
        <div className="page-container">
            <h2 className="page-title">חיפוש טיסות</h2>
            
            {error && <div className="alert-error">⚠️ {error}</div>}
            
            <SearchForm airports={airports} onSearch={handleSearchSubmit} />

            {loading && <p className="status-loading">🔎 מחפש טיסות מתאימות, רק רגע...</p>}
            
            {searchResults && (
                <FlightResults 
                    results={searchResults} 
                    selectedOutbound={selectedOutbound}
                    selectedInbound={selectedInbound}
                    onSelectFlight={handleSelectFlight}
                />
            )}

            {(selectedOutbound || selectedInbound) && (
                <div className="floating-summary-bar">
                    <div>
                        <h4 className="summary-title">הבחירה שלך ({searchPassengers} נוסעים):</h4>
                        <div className="summary-details">
                            {/* תוקן: הוספו גרשיים אלכסוניים (` `) מסביב למחרוזות */}
                            {selectedOutbound && `🛫 הלוך: ${selectedOutbound.flight_number} (${selectedOutbound.price}$)`}
                            {selectedInbound && ` | 🛬 חזור: ${selectedInbound.flight_number} (${selectedInbound.price}$)`}
                        </div>
                        <strong className="summary-total-price">
                            סה"כ לתשלום עבור כל הנוסעים: {calculateTotal()} $
                        </strong>
                    </div>

                    <button
                        type="button"
                        disabled={!isSelectionComplete()}
                        onClick={() => {
                            // מעביר לעמוד ההזמנה, ושולח אליו ב"מזוודה" (state) את נתוני הטיסה
                            navigate('/book', {
                                state: {
                                    selectedOutbound,
                                    selectedInbound,
                                    searchPassengers,
                                    totalPrice: calculateTotal()
                                }
                            });
                        }}
                       
                        className={`checkout-btn ${isSelectionComplete() ? 'enabled' : ''}`}
                    >
                        {isSelectionComplete() ? 'המשך להזמנה ➔' : 'נא לבחור טיסות להמשך'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlightSearchPage;