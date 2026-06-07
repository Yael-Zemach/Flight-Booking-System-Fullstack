import { api } from './api'; 

export const flightsApi = {
    searchFlights: (searchParams) => {
        const queryString = new URLSearchParams(searchParams).toString();
        return api.get(`/api/flights/search?${queryString}`);
    },

    createFlight: (flightData) => {
        return api.post('/api/admin/flights', flightData);
    },

    updateFlight: (flightId, flightData) => {
        return api.put(`/api/admin/flights/${flightId}`, flightData);
    },

    cancelFlight: (flightId) => {
        return api.patch(`/api/admin/flights/${flightId}/cancel`);
    }
};