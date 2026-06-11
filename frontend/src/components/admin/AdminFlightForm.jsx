import React, { useState, useEffect } from 'react';
import AirportAutocomplete from '../common/Flights/AirportAutocomplete.jsx';
import FlightDatePicker from '../common/Flights/FlightDatePicker.jsx'; // 🌟 ייבוא רכיב התאריך המשותף

export default function AdminFlightForm({ airports, editingFlight, onCancelEdit, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        flight_number: '', departure_airport_id: '', arrival_airport_id: '',
        departure_time: '', arrival_time: '', price: '', seats_available: ''
    });

    const tlvAirport = airports.find(ap => ap.airport_code === 'TLV');
    const tlvId = tlvAirport ? String(tlvAirport.airport_id) : '';

    const formatDateTimeForInput = (dateString) => {
        if (!dateString) return '';
        const d = new Date(dateString);
        const pad = (num) => String(num).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    useEffect(() => {
        if (editingFlight) {
            setFormData({
                flight_number: editingFlight.flight_number,
                departure_airport_id: editingFlight.departure_airport_id || '',
                arrival_airport_id: editingFlight.arrival_airport_id || '',
                departure_time: formatDateTimeForInput(editingFlight.departure_time),
                arrival_time: formatDateTimeForInput(editingFlight.arrival_time),
                price: editingFlight.price,
                seats_available: editingFlight.seats_available
            });
        } else {
            setFormData({
                flight_number: '', departure_airport_id: '', arrival_airport_id: '',
                departure_time: '', arrival_time: '', price: '', seats_available: ''
            });
        }
    }, [editingFlight, airports]);

    const getAvailableDestinations = () => {
        if (!tlvId || !formData.departure_airport_id) return airports;
        if (String(formData.departure_airport_id) === tlvId) {
            return airports.filter(ap => String(ap.airport_id) !== tlvId);
        } else {
            return airports.filter(ap => String(ap.airport_id) === tlvId);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <section className="form-section">
            <h3>{editingFlight ? `📝 עריכת פרטי טיסה (${editingFlight.flight_number})` : '➕ הוספת טיסה חדשה'}</h3>
            <form onSubmit={handleSubmit} className="admin-flight-form">
                <div className="form-group">
                    <label>מספר טיסה</label>
                    <input type="text" name="flight_number" value={formData.flight_number} onChange={(e) => setFormData(p => ({ ...p, flight_number: e.target.value }))} required placeholder="LY311" />
                </div>

                <AirportAutocomplete 
                    airports={airports} value={formData.departure_airport_id} idKey="airport_id" label="שדה מוצא" placeholder="הקלידי עיר או קוד שדה..."
                    onChange={(ap) => {
                        setFormData(prev => {
                            const updated = { ...prev, departure_airport_id: ap ? String(ap.airport_id) : '' };
                            if (ap && String(ap.airport_id) !== tlvId) {
                                updated.arrival_airport_id = tlvId;
                            } else if (ap && String(ap.airport_id) === tlvId && prev.arrival_airport_id === tlvId) {
                                updated.arrival_airport_id = '';
                            }
                            return updated;
                        });
                    }}
                />

                <AirportAutocomplete 
                    airports={getAvailableDestinations()} value={formData.arrival_airport_id} idKey="airport_id" label="שדה יעד" placeholder="הקלידי עיר או קוד שדה..."
                    disabled={formData.departure_airport_id && String(formData.departure_airport_id) !== tlvId}
                    onChange={(ap) => setFormData(p => ({ ...p, arrival_airport_id: ap ? String(ap.airport_id) : '' }))}
                />

                {/* 🌟 שימוש ברכיב המשותף עבור זמן המראה (כולל שעות ודקות) */}
                <FlightDatePicker 
                    label="זמן המראה"
                    type="datetime-local" // משתנה לטובת שילוב שעות ודקות עבור האדמין
                    value={formData.departure_time}
                    onChange={(e) => setFormData(p => ({ ...p, departure_time: e.target.value }))}
                    className="form-group" // שומר על ה-class המקורי של האדמין
                />

                {/* 🌟 שימוש ברכיב המשותף עבור זמן נחיתה (כולל שעות ודקות) */}
                <FlightDatePicker 
                    label="זמן נחיתה"
                    type="datetime-local"
                    value={formData.arrival_time}
                    onChange={(e) => setFormData(p => ({ ...p, arrival_time: e.target.value }))}
                    className="form-group"
                />

                <div className="form-group">
                    <label>מחיר ($)</label>
                    <input type="number" name="price" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} required min="1" />
                </div>
                <div className="form-group">
                    <label>מושבים</label>
                    <input type="number" name="seats_available" value={formData.seats_available} onChange={(e) => setFormData(p => ({ ...p, seats_available: e.target.value }))} required min="1" />
                </div>
                <div className="form-action-buttons">
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {editingFlight ? 'שמור שינויים' : 'צור טיסה'}
                    </button>
                    {editingFlight && (
                        <button type="button" className="cancel-edit-btn" onClick={onCancelEdit}>
                            ביטול עריכה
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}