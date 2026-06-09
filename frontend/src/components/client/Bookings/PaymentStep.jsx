import React, { useState } from 'react';

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
        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '8px', maxWidth: '500px', margin: '0 auto', border: '1px solid #e2e8f0' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>פרטי תשלום</h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    סה"כ לתשלום: ${totalPrice}
                </div>
            </div>

            <form onSubmit={handlePayment}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>מספר כרטיס אשראי</label>
                    <input 
                        type="text" 
                        maxLength="16"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                        disabled={isProcessing}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>תוקף (MM/YY)</label>
                        <input 
                            type="text" 
                            maxLength="5"
                            placeholder="12/25"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            required
                            disabled={isProcessing}
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>CVV (3 ספרות)</label>
                        <input 
                            type="text" 
                            maxLength="3"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                            disabled={isProcessing}
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>שם בעל הכרטיס (כפי שמופיע על הכרטיס)</label>
                    <input 
                        type="text" 
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        required
                        disabled={isProcessing}
                        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isProcessing}
                    style={{ 
                        width: '100%', 
                        padding: '14px', 
                        background: isProcessing ? '#9ca3af' : '#10b981', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '6px', 
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isProcessing ? '🔄 מתבצעת התקשרות לחברת האשראי...' : 'אשר תשלום והזמן 🔒'}
                </button>
            </form>
        </div>
    );
}