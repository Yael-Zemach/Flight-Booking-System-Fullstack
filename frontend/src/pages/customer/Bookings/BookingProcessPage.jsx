import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { createBooking, payForBooking } from '../../../API/bookingAPI.js';
import { UI_MESSAGES } from '../../../constants/messages.js';

// ייבוא הקומפוננטות ה"טיפשות"
import PassengersForm from '../../../components/client/Bookings/PassengerForm.jsx';
import PaymentStep from '../../../components/client/Bookings/PaymentStep.jsx';

import '../../../style/Bookings/BookingProcessPage.css'; // ייבוא ה-CSS

export default function BookingProcessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 🌟 שליפת נתוני ההלוך (selectedOutbound) והחזור (selectedInbound) מה-state של החיפוש
    const { selectedOutbound, selectedInbound, searchPassengers, totalPrice } = location.state || {};

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
            
            // 🌟 שליחת הבקשה לשרת עם שני מזהי הטיסות
            const response = await createBooking({
                flightId: selectedOutbound.flight_id, 
                returnFlightId: selectedInbound ? selectedInbound.flight_id : null, // שליחת חזור אם קיים
                totalPrice: totalPrice,
                passengers: passengersArray
            });
            
            setBookingId(response.bookingId);
            setStep(2);
        } catch (err) {
            setError(err.message || UI_MESSAGES.booking.bookingProcessError);
        }
    };

    const handlePaymentSuccess = async () => {
        try {
            setError(null);
            await payForBooking(bookingId);
            setStep(3);
        } catch (err) {
            setError(err.message || UI_MESSAGES.booking.paymentError);
        }
    };

    return (
        <div className="booking-process-container">
            <div className="steps-indicator">
                <span className={step === 1 ? 'step-item active' : 'step-item'}>{UI_MESSAGES.booking.steps.passengerDetails}</span>
                <span className={step === 2 ? 'step-item active' : 'step-item'}>{UI_MESSAGES.booking.steps.payment}</span>
                <span className={step === 3 ? 'step-item completed' : 'step-item'}>{UI_MESSAGES.booking.steps.confirmation}</span>
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
                    <h2 className="success-title">{UI_MESSAGES.booking.bookingApprovedTitle}</h2>
                    <p>{UI_MESSAGES.booking.bookingIdLabel} <strong>{bookingId}</strong></p>
                    <button className="nav-button" onClick={() => navigate('/my-bookings')}>
                        {UI_MESSAGES.booking.goToMyBookings}
                    </button>
                </div>
            )}
        </div>
    );
}