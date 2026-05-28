import { findRelevantFlights } from '../services/flightsService.js';

export async function searchFlights(req, res) {
    try {
        const { tripType, origin, dest, departDate, returnDate, passengers } = req.query;

        if (origin !== 'TLV' && dest !== 'TLV') {
            return res.status(400).json({ message: "טיסות חייבות להמריא או לנחות ב-TLV." });
        }

        const numPassengers = parseInt(passengers) || 1;

        const searchResults = await findRelevantFlights(tripType, origin, dest, departDate, returnDate, numPassengers);

        return res.status(200).json(searchResults);

    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({ message: "שגיאה פנימית בעת חיפוש הטיסות." });
    }
}