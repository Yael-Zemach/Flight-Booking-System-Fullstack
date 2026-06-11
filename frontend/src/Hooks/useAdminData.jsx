import { useState, useEffect } from 'react';
import { getAllAirports } from '../API/airportsAPI.js';
import { flightsApi } from '../API/flightsAPI';

export function useAdminData(selectedDate) {
    const [airports, setAirports] = useState([]);
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAdminData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. שדות תעופה שולפים תמיד (זו רשימה קטנה וקבועה)
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

    // בכל פעם שהאדמין משנה תאריך במסך, ה-useEffect ירוץ ויביא רק את הטיסות של אותו יום
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