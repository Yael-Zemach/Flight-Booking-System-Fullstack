import React, { useState, useEffect } from 'react';
import { flightsApi } from '../../API/flightsAPI.js';
import { UI_MESSAGES } from '../../constants/messages.js';
import { getAllAirports } from '../../API/airportsAPI.js';
import SearchForm from '../../components/common/Flights/SearchForm.jsx';
import FlightResults from '../../components/common/Flights/FlightResults.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/Flights/FlightSearchPage.css';

const FlightSearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prefilledDestination = location.state?.selectedDestination;
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
            <h2 className="page-title">{UI_MESSAGES.search.pageTitle}</h2>

            {error && <div className="alert-error">⚠️ {error}</div>}

            <SearchForm airports={airports} onSearch={handleSearchSubmit} prefilledDestination={prefilledDestination} />

            {loading && <p className="status-loading">{UI_MESSAGES.search.loading}</p>}

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
                        <h4 className="summary-title">{UI_MESSAGES.search.yourSelection} ({searchPassengers} {UI_MESSAGES.search.passengersLabel.toLowerCase()}):</h4>
                        <div className="summary-details">
                            {selectedOutbound && `🛫 ${UI_MESSAGES.search.outboundLabel}: ${selectedOutbound.flight_number} (${selectedOutbound.price}$)`}
                            {selectedInbound && ` | 🛬 ${UI_MESSAGES.search.inboundLabel}: ${selectedInbound.flight_number} (${selectedInbound.price}$)`}
                        </div>
                        <strong className="summary-total-price">
                            {UI_MESSAGES.search.totalLabel} {calculateTotal()} $
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
                        {isSelectionComplete() ? UI_MESSAGES.search.continueToBooking : UI_MESSAGES.search.selectFlightsPrompt}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlightSearchPage;