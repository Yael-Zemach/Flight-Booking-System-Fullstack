import React, { useState } from 'react';

export default function AdminAirportRow({ airport, onDelete, onUpdateImage }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setIsUploading(true);
            await onUpdateImage(airport.airport_id, false, file);
            alert('התמונה עודכנה בהצלחה!');
        } catch (err) {} finally { setIsUploading(false); }
    };

    const handleUrlEditClick = async () => {
        const newUrl = window.prompt('אנא הדביקי את כתובת ה-URL החדשה:', airport.image_url);
        if (!newUrl || !newUrl.trim() || newUrl === airport.image_url) return;
        try {
            setIsUploading(true);
            await onUpdateImage(airport.airport_id, true, newUrl.trim());
            alert('הקישור עודכן בהצלחה!');
        } catch (err) {} finally { setIsUploading(false); }
    };

    return (
        <div className="airport-custom-card">
            {/* שורה 1: נתוני שדה התעופה והתמונה */}
            <div className="airport-card-top-row">
                <div className="airport-info-item code"><strong>{airport.airport_code}</strong></div>
                <div className="airport-info-item name">{airport.airport_name}</div>
                <div className="airport-info-item location">{airport.city}, {airport.country}</div>
                <div className="airport-info-item thumb">
                    <img src={airport.image_url} alt={airport.city} className="airport-table-thumbnail" />
                </div>
            </div>

            {/* שורה 2: כפתורי הפעולה של האדמין (פרוסים לרוחב למטה ללא גלגלת אופקית!) */}
            <div className="airport-card-bottom-actions">
                <span className="actions-label">פעולות מנהל:</span>
                
                <div className="upload-btn-wrapper">
                    <label className={`upload-file-label ${isUploading ? 'uploading' : ''}`}>
                        {isUploading ? '🔄 מעלה...' : '📷 החלף קובץ'}
                        <input type="file" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                    </label>
                </div>

                <button className="edit-btn-inline" onClick={handleUrlEditClick} disabled={isUploading}>
                    🌐 עדכן קישור URL
                </button>

                <button className="cancel-btn-inline" onClick={() => onDelete(airport.airport_id)} disabled={isUploading}>
                    🛑 מחק שדה תעופה
                </button>
            </div>
        </div>
    );
}