import React from 'react';

export default function AdminAirportSearch({ searchTerm, onSearchChange }) {
    return (
        <div className="search-section-compact">
            <div className="search-icon-wrapper">🔍</div>
            <input 
                type="text" 
                value={searchTerm || ''} // הגנה מוחלטת: תמיד מחרוזת מוגדרת
                onChange={(e) => onSearchChange(e.target.value)} 
                placeholder="סינון מהיר בזמן אמת לפי קוד שדה (TLV), שם, עיר או מדינה..." 
                className="search-input-field"
            />
        </div>
    );
}