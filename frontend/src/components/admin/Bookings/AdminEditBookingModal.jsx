import React, { useState } from 'react';
import { adminUpdateBookingFull } from '../../../API/bookingAPI';
import '../../../style/Admin/AdminEditBookingModal.css';

const formatDateForInput = (dateVal) => {
    if (!dateVal) return '';
    try {
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return '';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    } catch (e) {
        return '';
    }
};

export default function AdminEditBookingModal({ userId, booking, onClose, onSuccess }) {
    const [status, setStatus] = useState(booking.status);
    const [totalPrice, setTotalPrice] = useState(booking.total_price);
    const [passengers, setPassengers] = useState(booking.passengers || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const pricePerTicket = booking.passengers && booking.passengers.length > 0
        ? booking.total_price / booking.passengers.length
        : 0;

    // 🌟 תיקון 1: עדכון סטייט בצורה אימוטבילית (Immutable) עם .map() כדי למנוע באגים ברינדור
    const handlePassengerChange = (index, field, value) => {
        setPassengers(prevPassengers =>
            prevPassengers.map((pax, i) =>
                i === index ? { ...pax, [field]: value } : pax
            )
        );
    };

    const handleAddPassenger = () => {
        setPassengers([...passengers, { first_name: '', last_name: '', date_of_birth: '', gender: 'male', email: '', phone: '' }]);
        setTotalPrice(prev => (Number(prev) + pricePerTicket).toFixed(2));
    };

    const handleRemovePassenger = (index) => {
        const updated = passengers.filter((_, i) => i !== index);
        setPassengers(updated);
        setTotalPrice(prev => Math.max(0, Number(prev) - pricePerTicket).toFixed(2));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const cleanedPassengers = passengers.map(pax => ({
                ...pax,
                date_of_birth: formatDateForInput(pax.date_of_birth)
            }));
            const payload = {
                flightId: booking.flight_id,
                returnFlightId: booking.return_flight_id || null,
                totalPrice: Number(totalPrice),
                passengers: cleanedPassengers
            };

            await adminUpdateBookingFull(userId, booking.booking_id, payload);
            alert('ההזמנה עודכנה בהצלחה!');
            onSuccess();
        } catch (err) {
            setError(err.message || 'שגיאה בעדכון ההזמנה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content">
                <h3>✏️ עריכת הזמנה #{booking.booking_id}</h3>
                {/* 🌟 שינוי: הוספת סיכום קטן של פרטי הטיסה (הלוך/חזור) בתוך המודאל לקבלת קונטקסט */}
                <div className="admin-modal-flight-summary" style={{ marginBottom: '15px', fontSize: '14px', color: '#555' }}>
                  <p><strong>🛫 טיסת הלוך:</strong> {booking.flight_number} ({booking.departure_city} ⬅️ {booking.arrival_city})</p>
                  {booking.return_flight_number && (
                    <p><strong>🛬 טיסת חזור:</strong> {booking.return_flight_number} ({booking.return_departure_city} ⬅️ {booking.return_arrival_city})</p>
                  )}
                </div>


                {error && <div className="admin-modal-error">{error}</div>}

                <form className="admin-modal-form" onSubmit={handleSubmit}>
                    <div className="admin-modal-row">
                        <div className="admin-modal-col">
                            <label>סטטוס ההזמנה:</label>
                            <span className="admin-modal-text-status">
                                {status === 'confirmed' && 'מאושרת (Confirmed)'}
                                {status === 'cancelled' && 'מבוטלת (Cancelled)'}
                                {status === 'pending' && 'ממתינה (Pending)'}
                            </span>
                        </div>

                        <div className="admin-modal-col">
                            <label>סה"כ לתשלום ($):</label>
                            <input className="admin-modal-input" type="number" step="0.01" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} required />
                        </div>
                    </div>

                    <hr />

                    <div className="admin-modal-header-row">
                        <h4>👥 ניהול נוסעים ({passengers.length})</h4>
                        <button type="button" className="admin-modal-btn-add" onClick={handleAddPassenger}>
                            + הוסף נוסע חדש
                        </button>
                    </div>

                    {passengers.map((pax, index) => (
                        <div key={index} className="admin-modal-pax-card">
                            <button type="button" className="admin-modal-btn-remove" onClick={() => handleRemovePassenger(index)}>
                                הסר 🗑️
                            </button>

                            {/* 🌟 תיקון 2: תיקון כתיבת ה-JSX של כותרת ותעודת הזהות של הנוסע */}
                            <p className="admin-modal-pax-title">
                                נוסע {index + 1} {pax.passenger_id ? `(ID: ${pax.passenger_id})` : '(נוסע חדש - יתווסף לשמירה)'}
                            </p>

                            <div className="admin-modal-pax-grid">
                                <input className="admin-modal-pax-input" type="text" placeholder="שם פרטי" value={pax.first_name} onChange={(e) => handlePassengerChange(index, 'first_name', e.target.value)} required />
                                <input className="admin-modal-pax-input" type="text" placeholder="שם משפחה" value={pax.last_name} onChange={(e) => handlePassengerChange(index, 'last_name', e.target.value)} required />

                                <input
                                    className="admin-modal-pax-input"
                                    type="date"
                                    value={formatDateForInput(pax.date_of_birth)}
                                    onChange={(e) => handlePassengerChange(index, 'date_of_birth', e.target.value)}
                                    required
                                />

                                <select className="admin-modal-pax-input" value={pax.gender} onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}>
                                    <option value="male">זכר</option>
                                    <option value="female">נקבה</option>
                                    <option value="other">אחר</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    <div className="admin-modal-actions">
                        <button type="submit" className="admin-modal-btn-submit" disabled={loading}>
                            {loading ? 'שומר במערכת...' : '💾 שמור שינויים'}
                        </button>
                        <button type="button" className="admin-modal-btn-cancel" onClick={onClose}>
                            ביטול וסגירה
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}