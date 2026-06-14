import * as flightsModel from '../models/flightsModel.js';
import { ERROR_CODES } from '../constants/errorCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { TRIP_TYPES } from '../constants/tripTypes.js';

const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; 
};

const isValidConnection = (outboundFlight, inboundFlight) => {
    const outArrival = new Date(outboundFlight.arrival_time).getTime();
    const inDepart = new Date(inboundFlight.departure_time).getTime();

    const hoursDiff = (inDepart - outArrival) / (1000 * 60 * 60);
    return hoursDiff >= 3;
};

export async function findRelevantFlights(tripType, origin, dest, departDate, returnDate, passengers) {
    if (origin !== 'TLV' && dest !== 'TLV') {
        throw new Error(ERROR_CODES.INVALID_AIRPORTS || 'TLV_REQUIRED');
    }
    let isFlexibleSearch = false; 
    let outbound = await flightsModel.getFlightsByDateRange(origin, dest, departDate, departDate, passengers);
    let inbound = [];

    if (tripType === TRIP_TYPES.ROUND_TRIP && returnDate) {
        inbound = await flightsModel.getFlightsByDateRange(dest, origin, returnDate, returnDate, passengers);
    }
    let hasExactResults = outbound.length > 0 && (tripType === TRIP_TYPES.ONE_WAY || inbound.length > 0);
    if (hasExactResults && tripType === TRIP_TYPES.ROUND_TRIP) {
        outbound = outbound.filter(out => inbound.some(inb => isValidConnection(out, inb)));
        inbound = inbound.filter(inb => outbound.some(out => isValidConnection(out, inb)));
        if (outbound.length === 0 || inbound.length === 0) {
            hasExactResults = false;
        }
    }

    if (!hasExactResults) {
        let allowFlexible = true;
        if (tripType === TRIP_TYPES.ROUND_TRIP && returnDate) {
            const departTime = new Date(departDate).getTime();
            const returnTime = new Date(returnDate).getTime();
            const daysDiff = (returnTime - departTime) / (1000 * 60 * 60 * 24);

            if (daysDiff <= 2) {
                allowFlexible = false;
            }
        }

        if (allowFlexible) {
            isFlexibleSearch = true; 
            const flexDepartStart = addDays(departDate, -2);
            const flexDepartEnd = addDays(departDate, 2);
            outbound = await flightsModel.getFlightsByDateRange(origin, dest, flexDepartStart, flexDepartEnd, passengers);
            if (tripType === TRIP_TYPES.ROUND_TRIP && returnDate) {
                const flexReturnStart = addDays(returnDate, -2);
                const flexReturnEnd = addDays(returnDate, 2);
                inbound = await flightsModel.getFlightsByDateRange(dest, origin, flexReturnStart, flexReturnEnd, passengers);
                outbound = outbound.filter(out => inbound.some(inb => isValidConnection(out, inb)));
                inbound = inbound.filter(inb => outbound.some(out => isValidConnection(out, inb)));


            }
        } else {
            outbound = [];
            inbound = [];
        }
    }


    return {
        isFlexible: isFlexibleSearch,
        outbound: outbound,
        inbound: inbound
    };
}

export async function createNewFlight(flightData) {
    const { flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price, seats_available } = flightData;

    if (!flight_number || !departure_airport_id || !arrival_airport_id || !departure_time || !arrival_time || price === undefined || seats_available === undefined) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }
    if (departure_airport_id === arrival_airport_id) {
        throw new Error(ERROR_CODES.INVALID_AIRPORTS);
    }

    if (new Date(departure_time) < new Date()) {
        throw new Error(ERROR_CODES.DEPARTURE_TIME_IN_PAST);
    }

    if (new Date(departure_time) >= new Date(arrival_time)) {
        throw new Error(ERROR_CODES.INVALID_DATES);
    }

    return await flightsModel.insertFlight(
        flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price, seats_available
    );
}

export async function updateExistingFlight(flightId, flightData) {
    const { flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price, seats_available } = flightData;

    if (!flight_number || !departure_airport_id || !arrival_airport_id || !departure_time || !arrival_time || price === undefined || seats_available === undefined) {
        throw new Error(ERROR_CODES.MISSING_DATA);
    }
    if (departure_airport_id === arrival_airport_id) {
        throw new Error(ERROR_CODES.INVALID_AIRPORTS);
    }

    if (new Date(departure_time) < new Date()) {
        throw new Error(ERROR_CODES.DEPARTURE_TIME_IN_PAST);
    }

    if (new Date(departure_time) >= new Date(arrival_time)) {
        throw new Error(ERROR_CODES.INVALID_DATES);
    }

    const success = await flightsModel.updateFlightDetails(
        flightId, flight_number, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price, seats_available
    );

    if (!success) {
        throw new Error(ERROR_CODES.NOT_FOUND);
    }
    return success;
}

export async function cancelFlight(flightId) {
    try {
        await flightsModel.cancelFlightAndBookings(flightId);
        return true;
    } catch (error) {
        if (error.message === ERROR_CODES.NOT_FOUND_OR_ALREADY_CANCELLED) {
            throw new Error(ERROR_CODES.ALREADY_CANCELLED);
        }
        throw error;
    }
}

export async function getAdminFlightsByDate(date) {
    if (!date) {
        throw new Error(MESSAGES.FLIGHTS.DATE_REQUIRED);
    }
    return await flightsModel.getFlightsByDateForAdmin(date);
}