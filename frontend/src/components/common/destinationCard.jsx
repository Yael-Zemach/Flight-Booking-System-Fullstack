import React from 'react';
import { UI_MESSAGES } from '../../constants/messages.js';

export default function DestinationCard({ destination, onBook }) {
    return (
        <div className="destination-card">
            <img 
                src={destination.image_url || 'https://via.placeholder.com/400x200?text=No+Imageal'} 
                alt={destination.city} 
                className="destination-image" 
            />
            <div className="destination-content">
                    <div>
                    <h3 className="destination-name">{destination.city} ({destination.airport_code})</h3>
                    <p className="destination-desc">
                        {destination.description || `טוסו איתנו ליעד המדהים ${destination.city}! חוויה בלתי נשכחת במרחק טיסה.`}
                    </p>
                </div>
                <button className="book-flight-btn" onClick={() => onBook(destination.city)}>
                    חפש טיסות ליעד ✈️
                </button>
            </div>
        </div>
    );
}