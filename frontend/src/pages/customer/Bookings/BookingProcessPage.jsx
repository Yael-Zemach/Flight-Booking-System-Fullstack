import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { createBooking, payForBooking } from '../../../API/bookingAPI.js';

// ייבוא הקומפוננטות ה"טיפשות"
import PassengersForm from '../../../components/client/Bookings/PassengerForm.jsx';
import PaymentStep from '../../../components/client/Bookings/PaymentStep.jsx';

import '../../../style/Bookings/BookingProcessPage.css'; // ייבוא ה-CSS

export default function BookingProcessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { selectedOutbound, searchPassengers, totalPrice } = location.state || {};

    const [step, setStep] = useState(1);
    const [bookingId, setBookingId] = useState(null);
    const [error, setError] = useState(null);

    // הגנה: אם המשתמש הגיע לעמוד הזה ישירות מה-URL בלי לבחור טיסה
    if (!selectedOutbound) {
        return <Navigate to="/" replace />;
    }

    const handlePassengersSubmit = async (passengersArray) => {
        try {
            setError(null);
            const response = await createBooking({
                flightId: selectedOutbound.flight_id, 
                totalPrice: totalPrice,
                passengers: passengersArray
            });
            
            setBookingId(response.bookingId);
            setStep(2);
        } catch (err) {
            setError(err.message || "שגיאה ביצירת ההזמנה. אנא נסה שוב.");
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            setError(null);
            await payForBooking(bookingId);
            setStep(3);
        } catch (err) {
            setError(err.message || "שגיאה באישור התשלום.");
        }
    };

    return (
        <div className="booking-process-container">
            <div className="steps-indicator">
                <span className={step === 1 ? 'step-item active' : 'step-item'}>1. פרטי נוסעים</span>
                <span className={step === 2 ? 'step-item active' : 'step-item'}>2. תשלום באשראי</span>
                <span className={step === 3 ? 'step-item completed' : 'step-item'}>3. אישור הזמנה</span>
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            {step === 1 && (
                <PassengersForm 
                    numberOfPassengers={searchPassengers} 
                    onSubmit={handlePassengersSubmit} 
                />
            )}

            {step === 2 && (
                <PaymentStep 
                    totalPrice={totalPrice} 
                    onPaymentSuccess={handlePaymentSuccess} 
                />
            )}

            {step === 3 && (
                <div className="success-message">
                    <h2 className="success-title">🎉 ההזמנה אושרה בהצלחה!</h2>
                    <p>מספר ההזמנה שלך הוא: <strong>{bookingId}</strong></p>
                    <button className="nav-button" onClick={() => navigate('/my-bookings')}>
                        מעבר לאזור האישי
                    </button>
                </div>
            )}
        </div>
    );
}