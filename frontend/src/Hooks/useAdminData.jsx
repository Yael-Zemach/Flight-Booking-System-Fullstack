import { useState, useEffect } from 'react';
import { getAllAirports } from '../API/airportsAPI.js';
import { flightsApi } from '../API/flightsAPI.js';

export function useAdminData(selectedDate) {
    const [airports, setAirports] = useState([]);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAdminData = async () => {
        setLoading(true);
        setError(null);
        try {
            const airportsData = await getAllAirports();
            setAirports(airportsData);

         if (selectedDate) {
        const flightsData = await flightsApi.getAdminFlightsByDate(selectedDate);
        setFlights(flightsData || []); // השרת מחזיר ישר את הטיסות של אותו יום
    }
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, [selectedDate]);

    return { 
        airports, 
        flights, 
        loading, 
        error, 
        refreshData: loadAdminData 
    };
}