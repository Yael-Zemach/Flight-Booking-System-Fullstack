import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAirports } from '../../API/airportsAPI.js';
import { UI_MESSAGES } from '../../constants/messages.js';
import DestinationGrid from '../../components/client/Destinations/destinationGrid.jsx';
import '../../style/destinationStyle.css';

export default function DestinationPage() {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                setLoading(true);
                const data = await getAllAirports();
                setDestinations(data);
            } catch (err) {
                setError(err.message || UI_MESSAGES.destinations.failedToLoad);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    const handleBookDestination = (city) => {
        // Navigate to flight search with the selected destination
        navigate('/', { state: { selectedDestination: city } });
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>טוען יעדים...</div>;
    if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>⚠️ {error}</div>;

    return (
        <div className="destinations-container">
            <h2 className="destinations-title">✈️ יעדים פופולריים</h2>
            <p className="destinations-subtitle">בחר ליעד ותחפש את הטיסה המושלמת עבורך</p>
            <DestinationGrid destinations={destinations} onBookDestination={handleBookDestination} />
        </div>
    );
}