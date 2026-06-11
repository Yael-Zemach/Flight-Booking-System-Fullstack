import { api } from './api';
import API_ROUTES from '../constants/apiRoutes.js';

export const flightsApi = {
    searchFlights: (searchParams) => {
        const queryString = new URLSearchParams(searchParams).toString();
        return api.get(`${API_ROUTES.FLIGHTS.BASE}${API_ROUTES.FLIGHTS.SEARCH}?${queryString}`);
    },

    createFlight: (flightData) => {
        return api.post(`${API_ROUTES.FLIGHTS.BASE}${API_ROUTES.FLIGHTS.ADMIN}`, flightData);
    },

    updateFlight: (flightId, flightData) => {
        return api.put(`${API_ROUTES.FLIGHTS.BASE}${API_ROUTES.FLIGHTS.ADMIN_BY_ID.replace(':id', flightId)}`, flightData);
    },

    cancelFlight: (flightId) => {
        return api.patch(`${API_ROUTES.FLIGHTS.BASE}${API_ROUTES.FLIGHTS.ADMIN_CANCEL.replace(':id', flightId)}`);
    },
getAdminFlightsByDate: (date) => {
        return api.get(`${API_ROUTES.FLIGHTS.BASE}${API_ROUTES.FLIGHTS.ADMIN}?date=${date}`);
    },
};