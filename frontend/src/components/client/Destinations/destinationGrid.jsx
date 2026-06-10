import React from 'react';
import DestinationCard from './destinationCard';

export default function DestinationGrid({ destinations, onBookDestination }) {
    return (
        <div className="destinations-grid">
            {destinations.map((dest) => (
                <DestinationCard 
                    key={dest.airport_id} 
                    destination={dest} 
                    onBook={onBookDestination} 
                />
            ))}
        </div>
    );
}