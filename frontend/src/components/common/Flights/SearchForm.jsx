import React, { useState } from 'react';
import '../../../style/Flights/SearchForm.css'; // ייבוא ה-CSS שלך

const SearchForm = ({ airports, onSearch }) => {
    const [tripType, setTripType] = useState('round-trip'); 
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);

    // קוד שדה התעופה האמיתי (למשל 'TLV') שיישלח בחיפוש
    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');

    // הטקסט החופשי שהמשתמש רואה ומקליד בתיבות החיפוש
    const [originSearch, setOriginSearch] = useState('');
    const [destSearch, setDestSearch] = useState('');

    // ניהול פתיחה וסגירה של רשימות ה-Dropdown
    const [isOriginOpen, setIsOriginOpen] = useState(false);
    const [isDestOpen, setIsDestOpen] = useState(false);

    // פונקציית עזר לקבלת תאריך היום בפורמט YYYY-MM-DD עבור חסימת תאריכים בעבר
    const getTodayDateString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const todayStr = getTodayDateString();

    // 1. מיון שדות התעופה: שליפת תל אביב והצבתה אבסולוטית בראש הרשימה
    const getSortedAirports = () => {
        if (!airports || airports.length === 0) return [];

        // מוצאים את תל אביב ומנקים רווחים/אותיות קטנות ליתר ביטחון
        const tlvAirport = airports.find(
            ap => (ap.airport_code || '').trim().toUpperCase() === 'TLV'
        );
        
        // מסננים את כל השאר
        const otherAirports = airports.filter(
            ap => (ap.airport_code || '') !== 'TLV'
        );

        // ממיינים את השאר אלפביתית לפי שם העיר
        otherAirports.sort((a, b) => (a.city || '').localeCompare(b.city || '', 'he'));

        // מחזירים מערך מאוחד שבו תל אביב תמיד ראשונה
        return tlvAirport ? [tlvAirport, ...otherAirports] : otherAirports;
    };

    // 2. סינון רשימת המקור לפי מה שהמשתמש מקליד
    const filteredOrigins = getSortedAirports().filter(ap => {
        const searchTerm = originSearch.toLowerCase();
        return (
            ap.city.toLowerCase().includes(searchTerm) ||
            ap.airport_code.toLowerCase().includes(searchTerm)
        );
    });

    // 3. סינון רשימת היעד לפי החוקיות שלך + הטקסט שהוקלד
    const filteredDestinations = getSortedAirports().filter(ap => {
        const searchTerm = destSearch.toLowerCase();
        
        // החוקיות המקורית שלך: מניעת תל אביב לתל אביב או חו"ל לחו"ל
        if (origin === 'TLV' && ap.airport_code === 'TLV') return false;
        if (origin && origin !== 'TLV' && ap.airport_code !== 'TLV') return false;

        return (
            ap.city.toLowerCase().includes(searchTerm) ||
            ap.airport_code.toLowerCase().includes(searchTerm)
        );
    });

    // בחירת שדה מקור מהרשימה
    const handleSelectOrigin = (ap) => {
        setOrigin(ap.airport_code);
        setOriginSearch(`${ap.city} (${ap.airport_code})`);
        setIsOriginOpen(false);

        // אם המקור הוא חו"ל, היעד ננעל אוטומטית על תל אביב
        if (ap.airport_code !== 'TLV') {
            setDest('TLV');
            const tlvAirport = airports.find(a => a.airport_code === 'TLV');
            setDestSearch(tlvAirport ? `${tlvAirport.city} (TLV)` : 'תל אביב (TLV)');
        } else {
            setDest('');
            setDestSearch('');
        }
    };

    // בחירת שדה יעד מהרשימה
    const handleSelectDest = (ap) => {
        setDest(ap.airport_code);
        setDestSearch(`${ap.city} (${ap.airport_code})`);
        setIsDestOpen(false);
    };

    // טיפול בשינוי תאריך יציאה (מאפס את החזרה אם היא הופכת ללא חוקית)
    const handleDepartDateChange = (e) => {
        const newDepartDate = e.target.value;
        setDepartDate(newDepartDate);
        
        if (returnDate && newDepartDate > returnDate) {
            setReturnDate('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!origin || !dest || !departDate) {
            alert('נא למלא את כל שדות החובה ולבחור מיקום מתוך הרשימה הצפה');
            return;
        }
        if (tripType === 'round-trip' && !returnDate) {
            alert('נא למלא תאריך חזרה');
            return;
        }
        onSearch({ tripType, origin, dest, departDate, returnDate, passengers });
    };

    return (
        <form onSubmit={handleSubmit} className="search-form-container">
            <div className="trip-type-selector">
                <button 
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`}
                >
                    הלוך וחזור
                </button>
                <button 
                    type="button"
                    onClick={() => setTripType('one-way')}
                    className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}
                >
                    כיוון אחד
                </button>
            </div>

            <div className="form-inputs-grid">
                
                {/* שדה מקור (מאיפה) */}
                <div className="form-field-group autocomplete-wrapper">
                    <label>מאיפה? (מקור)</label>
                    <input 
                        type="text"
                        placeholder="הקלידי עיר או קוד שדה..."
                        value={originSearch}
                        onChange={(e) => {
                            setOriginSearch(e.target.value);
                            setOrigin(''); // מאפס את הקוד האמיתי עד שיבחר שוב מהרשימה
                        }}
                        onFocus={() => {
                            setIsOriginOpen(true);
                            setOriginSearch(''); // מאפס את המחרוזת כדי לפתוח את כל הרשימה
                        }}
                        onBlur={() => setTimeout(() => setIsOriginOpen(false), 200)} 
                        required
                        className="form-input-searchable"
                    />
                    {isOriginOpen && filteredOrigins.length > 0 && (
                        <ul className="autocomplete-dropdown">
                            {filteredOrigins.map(ap => (
                                <li key={ap.airport_code} onMouseDown={() => handleSelectOrigin(ap)}>
                                    <strong>{ap.city}</strong> ({ap.airport_code})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* שדה יעד (לאן) */}
                <div className="form-field-group autocomplete-wrapper">
                    <label>לאן? (יעד)</label>
                    <input 
                        type="text"
                        placeholder="הקלידי עיר או קוד שדה..."
                        value={destSearch}
                        onChange={(e) => {
                            setDestSearch(e.target.value);
                            setDest('');
                        }}
                        onFocus={() => {
                            setIsDestOpen(true);
                            setDestSearch(''); // מאפס את המחרוזת כדי לפתוח את כל הרשימה
                        }}
                        onBlur={() => setTimeout(() => setIsDestOpen(false), 200)}
                        disabled={origin && origin !== 'TLV'} // חסום אם כבר נבחר שדה בחו"ל
                        required
                        className="form-input-searchable"
                    />
                    {isDestOpen && filteredDestinations.length > 0 && (
                        <ul className="autocomplete-dropdown">
                            {filteredDestinations.map(ap => (
                                <li key={ap.airport_code} onMouseDown={() => handleSelectDest(ap)}>
                                    <strong>{ap.city}</strong> ({ap.airport_code})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* תאריך יציאה */}
                <div className="form-field-group">
                    <label>תאריך יציאה</label>
                    <input 
                        type="date" 
                        value={departDate} 
                        onChange={handleDepartDateChange} 
                        min={todayStr} // חוסם תאריכים בעבר
                        required 
                    />
                </div>

                {/* תאריך חזרה */}
                {tripType === 'round-trip' && (
                    <div className="form-field-group">
                        <label>תאריך חזרה</label>
                        <input 
                            type="date" 
                            value={returnDate} 
                            onChange={(e) => setReturnDate(e.target.value)} 
                            min={departDate || todayStr} // חוסם תאריכים שלפני תאריך היציאה שנבחר
                            required 
                        />
                    </div>
                )}

                {/* מספר נוסעים */}
                <div className="form-field-group">
                    <label>נוסעים</label>
                    <input 
                        type="number" 
                        min="1" 
                        max="9" 
                        value={passengers} 
                        onChange={(e) => setPassengers(e.target.value)} 
                        className="form-input-passengers" 
                    />
                </div>

                <button type="submit" className="search-submit-btn">
                    חפש טיסות
                </button>
            </div>
        </form>
    );
};

export default SearchForm;