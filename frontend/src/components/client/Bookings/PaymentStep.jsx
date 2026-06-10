import React, { useState } from 'react';
import '../../../style/Bookings/PaymentStep.css';

export default function PaymentStep({ totalPrice, onPaymentSuccess }) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = (e) => {
        e.preventDefault();
        
        // כאן אנחנו נכנסים למצב סליקה מדומה
        setIsProcessing(true);

        // שימוש ב-setTimeout כדי לדמות המתנה לתשובה מחברת האשראי (2 שניות)
        setTimeout(() => {
            // התשלום אושר "וירטואלית" - אנחנו מדווחים לאבא (BookingProcessPage)
            onPaymentSuccess();
        }, 2000); 
    };

    return (
        <div className="payment-step-container">
            <div className="payment-header">
                <h3 className="payment-title">פרטי תשלום</h3>
                <div className="payment-total">סה"כ לתשלום: ${totalPrice}</div>
            </div>

            <form onSubmit={handlePayment}>
                <div className="payment-field">
                    <label>מספר כרטיס אשראי</label>
                    <input 
                        type="text" 
                        maxLength="16"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        disabled={isProcessing}
                        className="payment-input"
                    />
                </div>

                <div className="payment-grid">
                    <div className="payment-field">
                        <label>תוקף (MM/YY)</label>
                        <input 
                            type="text" 
                            maxLength="5"
                            placeholder="12/25"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            required
                            disabled={isProcessing}
                            className="payment-input"
                        />
                    </div>
                    <div className="payment-field">
                        <label>CVV (3 ספרות)</label>
                        <input 
                            type="text" 
                            maxLength="3"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                            disabled={isProcessing}
                            className="payment-input"
                        />
                    </div>
                </div>

                <div className="payment-field">
                    <label>שם בעל הכרטיס (כפי שמופיע על הכרטיס)</label>
                    <input 
                        type="text" 
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        required
                        disabled={isProcessing}
                        className="payment-input"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="payment-action-btn"
                >
                    {isProcessing ? '🔄 מתבצעת התקשרות לחברת האשראי...' : 'אשר תשלום והזמן 🔒'}
                </button>
            </form>
        </div>
    );
}