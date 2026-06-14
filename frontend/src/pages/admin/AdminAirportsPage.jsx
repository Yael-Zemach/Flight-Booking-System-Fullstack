import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAirports, createAirport, deleteAirport, updateAirportImage } from '../../API/airportsAPI.js';
import AdminAirportForm from '../../components/admin/Airports/AdminAirportForm.jsx';
import AdminAirportsTable from '../../components/admin/Airports/AdminAirportsTable.jsx';
import AdminAirportSearch from '../../components/admin/Airports/AdminAirportSearch.jsx';
import { UI_MESSAGES } from '../../constants/messages.js';

import '../../style/AdminFlightsPage.css'; 
import '../../style/AdminAirportsPage.css'; 

export default function AdminAirportsPage() {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // מאותחל כמחרוזת ריקה למניעת שגיאות
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [systemMessage, setSystemMessage] = useState({ type: '', text: '' });

    const fetchAirportsData = async () => {
        try {
            setLoading(true);
            const data = await getAllAirports();
            setAirports(data || []);
        } catch (err) {
            setSystemMessage({ type: 'error', text: UI_MESSAGES.admin.airportLoadError + err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirportsData();
    }, []);

    const handleCreateAirportSubmit = async (formData, successCallback) => {
        setSystemMessage({ type: '', text: '' });
        try {
            setActionLoading(true);
            const response = await createAirport(formData);
            setSystemMessage({ type: 'success', text: response?.message || UI_MESSAGES.admin.airportAddedSuccess });
            successCallback(); 
            fetchAirportsData(); 
        } catch (err) {
            setSystemMessage({ type: 'error', text: err.message || UI_MESSAGES.admin.airportAddFailed });
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateAirportImageSubmit = async (airportId, isUrl, dataValue) => {
        setSystemMessage({ type: '', text: '' });
        try {
            const formData = new FormData();
            if (isUrl) {
                formData.append('image_url', dataValue);
            } else {
                formData.append('image', dataValue);
            }
            const response = await updateAirportImage(airportId, formData);
            setSystemMessage({ type: 'success', text: response?.message || UI_MESSAGES.admin.airportImageUpdated });
            fetchAirportsData(); 
        } catch (err) {
            setSystemMessage({ type: 'error', text: UI_MESSAGES.admin.airportImageUpdateFailed + err.message });
        }
    };

    const handleDeleteAirportClick = async (airportId) => {
        if (!window.confirm(UI_MESSAGES.admin.airportDeleteConfirm)) return;
        setSystemMessage({ type: '', text: '' });
        try {
            const response = await deleteAirport(airportId);
            setSystemMessage({ type: 'success', text: response?.message || UI_MESSAGES.admin.airportDeleted });
            fetchAirportsData();
        } catch (err) {
            setSystemMessage({ type: 'error', text: err.message || UI_MESSAGES.admin.airportDeleteFailed });
        }
    };

const filteredAirports = airports.filter(airport => {
    if (!searchTerm || !searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
        (airport.airport_code || '').toLowerCase().includes(term) ||
        (airport.airport_name || '').toLowerCase().includes(term) ||
        (airport.city || '').toLowerCase().includes(term) ||
        (airport.country || '').toLowerCase().includes(term)
    );
});
    return (
        <div className="admin-flights-fixed-layout">
            <header className="admin-flights-header" style={{ flexShrink: 0 }}>
                <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>⬅️ חזרה לדאשבורד</button>
                <h2 className="admin-flights-title">🗺️ ניהול נמלי ושדות תעופה</h2>
            </header>

            {systemMessage.text && (
                <div className={`alert-message ${systemMessage.type}`} style={{ flexShrink: 0 }}>
                    {systemMessage.text}
                </div>
            )}

            {/* קומפוננטות עליונות קבועות ומקובעות */}
            <AdminAirportForm onSubmit={handleCreateAirportSubmit} loading={actionLoading} />
            <AdminAirportSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* הטבלה היא היחידה שתקבל את הגלילה הפנימית שלה */}
            <AdminAirportsTable 
                airports={filteredAirports} 
                onDelete={handleDeleteAirportClick}
                onUpdateImage={handleUpdateAirportImageSubmit}
                loading={loading}
            />
        </div>
    );
}