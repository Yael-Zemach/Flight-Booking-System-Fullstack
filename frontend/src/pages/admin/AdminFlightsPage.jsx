import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '../../Hooks/useAdminData.jsx';
import { flightsApi } from '../../API/flightsAPI.js';
import AdminFlightForm from '../../components/admin/Flights/AdminFlightForm.jsx';
import AdminFlightsTable from '../../components/admin/Flights/AdminFlightsTable.jsx';
import { UI_MESSAGES } from '../../constants/messages.js';
import '../../style/AdminFlightsPage.css';

export default function AdminFlightsPage() {
    const navigate = useNavigate();
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
    const { airports, flights, loading, error, refreshData } = useAdminData(filterDate);
    
    const [editingFlight, setEditingFlight] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleFormSubmit = async (formData) => {
        setMessage({ type: '', text: '' });
        try {
            const dataToSend = {
                flight_number: formData.flight_number.trim().toUpperCase(),
                departure_airport_id: Number(formData.departure_airport_id),
                arrival_airport_id: Number(formData.arrival_airport_id),
                departure_time: formData.departure_time.replace('T', ' ') + ':00',
                arrival_time: formData.arrival_time.replace('T', ' ') + ':00',
                price: Number(formData.price),
                seats_available: Number(formData.seats_available),
                status: 'scheduled'
            };

            if (editingFlight) {
                const response = await flightsApi.updateFlight(editingFlight.flight_id, dataToSend);
                setMessage({ type: 'success', text: response.message || UI_MESSAGES.admin.flightUpdatedSuccess });
                setEditingFlight(null);
            } else {
                const response = await flightsApi.createFlight(dataToSend);
                setMessage({ type: 'success', text: response.message || UI_MESSAGES.admin.flightCreatedSuccess });
            }
            refreshData();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const handleCancelFlightClick = async (flightId) => {
        if (!window.confirm(UI_MESSAGES.admin.flightCancelConfirm)) return;
        try {
            const response = await flightsApi.cancelFlight(flightId);
            setMessage({ type: 'success', text: response.message || UI_MESSAGES.admin.flightCancelled });
            refreshData();
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div className="admin-flights-fixed-layout">
            <header className="admin-flights-header">
                <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>⬅️ חזרה לדאשבורד</button>
                <h2 className="admin-flights-title">✈️ ניהול לוח טיסות מנהל</h2>
            </header>

            {error && <div className="alert-message error">שגיאה במערכת: {error}</div>}
            {message.text && <div className={`alert-message ${message.type}`}>{message.text}</div>}

            <AdminFlightForm 
                airports={airports}
                editingFlight={editingFlight}
                onCancelEdit={() => setEditingFlight(null)}
                onSubmit={handleFormSubmit}
                loading={loading}
            />

            <AdminFlightsTable 
                flights={flights}
                editingFlightId={editingFlight?.flight_id || null}
                onStartEdit={setEditingFlight}
                onCancelFlight={handleCancelFlightClick}
                filterDate={filterDate}
                onFilterDateChange={setFilterDate}
                loading={loading}
            />
        </div>
    );
}