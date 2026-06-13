import React, { useState } from 'react';
import { UI_MESSAGES } from '../../../constants/messages.js';
import '../../../style/Bookings/PaymentStep.css';

export default function PaymentStep({ totalPrice, onPaymentSuccess }) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    
    const [isProcessing, setIsProcessing] = useState(false);

    // 🌟 1. ולידציה למספר כרטיס אשראי: רק מספרים
    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // מוחק כל תו שהוא לא מספר
        setCardNumber(value);
    };

    // 🌟 2. ולידציה והוספת סלאש אוטומטי לתוקף (MM/YY)
    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // משאיר רק מספרים
        
        // אם המשתמש הקליד יותר מ-2 ספרות, נדחף סלאש באמצע באופן אוטומטי
        if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
        }
        setExpiry(value);
    };

    // 🌟 3. ולידציה ל-CVV: רק מספרים עד 3 ספרות
    const handleCvvChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // משאיר רק מספרים
        setCvv(value);
    };

    // 🌟 4. ולידציה לשם: רק אותיות (בעברית/אנגלית) ורווחים, בלי מספרים או תווים מיוחדים
    const handleNameChange = (e) => {
        const value = e.target.value.replace(/[0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?~`-]/g, '');
        setNameOnCard(value);
    };

    const handlePayment = (e) => {
        e.preventDefault();
        
        // בדיקת בטיחות קטנה נוספת לפני השליחה
        if (cardNumber.length < 16) {
            alert(UI_MESSAGES.payment.cardNumberError);
            return;
        }
        if (expiry.length < 5) {
            alert(UI_MESSAGES.payment.expiryError);
            return;
        }
        if (cvv.length < 3) {
            alert(UI_MESSAGES.payment.cvvError);
            return;
        }

        setIsProcessing(true);

        // סימולציית התקשרות מול שרת הסליקה
        setTimeout(() => {
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
                        placeholder="0000000000000000"
                        value={cardNumber}
                        onChange={handleCardNumberChange} // 🌟 שימוש בפונקציה המסננת
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
                            onChange={handleExpiryChange} // 🌟 שימוש בפונקציה המסננת
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
                            onChange={handleCvvChange} // 🌟 שימוש בפונקציה המסננת
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
                        placeholder="John Doe"
                        value={nameOnCard}
                        onChange={handleNameChange} // 🌟 שימוש בפונקציה המסננת
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