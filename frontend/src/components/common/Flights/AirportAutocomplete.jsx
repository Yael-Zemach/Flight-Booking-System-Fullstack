import React, { useState, useEffect } from 'react';

export default function AirportAutocomplete({ 
    airports, 
    value, 
    idKey = 'airport_code', // ברירת מחדל לקוד (כמו TLV), האדמין יעביר 'airport_id'
    onChange, 
    label, 
    placeholder, 
    disabled 
}) {
    const [searchVal, setSearchVal] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // 1. מיון הרשימה שמתקבלת: הצבת תל אביב (TLV) תמיד ראשונה אבסולוטית
    const getSortedAirports = (list) => {
        if (!list || list.length === 0) return [];
        const tlv = list.find(ap => (ap.airport_code || '').trim().toUpperCase() === 'TLV');
        const others = list.filter(ap => (ap.airport_code || '') !== 'TLV');
        others.sort((a, b) => (a.city || '').localeCompare(b.city || '', 'he'));
        return tlv ? [tlv, ...others] : others;
    };

    // 2. סנכרון תצוגת הטקסט באינפוט כאשר ה-value משתנה (למשל בטעינת עריכה או prefill)
    useEffect(() => {
        if (value && airports && airports.length > 0) {
            const selected = airports.find(ap => String(ap[idKey]) === String(value));
            if (selected) {
                setSearchVal(`${selected.city} (${selected.airport_code})`);
                return;
            }
        }
        setSearchVal('');
    }, [value, airports]);

    // 3. סינון הרשימה בזמן אמת לפי מה שהמשתמש מקליד בתיבה
    const sortedList = getSortedAirports(airports);
    const filteredList = sortedList.filter(ap => {
        const term = searchVal.toLowerCase();
        return (
            (ap.city || '').toLowerCase().includes(term) ||
            (ap.airport_code || '').toLowerCase().includes(term)
        );
    });

    const handleSelect = (ap) => {
        setSearchVal(`${ap.city} (${ap.airport_code})`);
        setIsOpen(false);
        onChange(ap); // מחזיר את אובייקט שדה התעופה השלם לקומפוננטת האב
    };

    return (
        <div className="form-field-group autocomplete-wrapper">
            <label>{label}</label>
            <input 
                type="text"
                placeholder={placeholder}
                value={searchVal}
                onChange={(e) => {
                    setSearchVal(e.target.value);
                    if (!e.target.value) onChange(null); // איפוס הבחירה אם מחקו הכל
                }}
                onFocus={() => {
                    if (!disabled) {
                        setIsOpen(true);
                        setSearchVal(''); // מרוקן זמנית בפוקוס כדי להציג את כל האפשרויות המותרות
                    }
                }}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)} // השהייה קלה כדי לאפשר ללחיצה על ה-li להיתפס
                disabled={disabled}
                required
                className="form-input-searchable"
            />
            {isOpen && filteredList.length > 0 && (
                <ul className="autocomplete-dropdown">
                    {filteredList.map(ap => (
                        <li key={ap.airport_code} onMouseDown={() => handleSelect(ap)}>
                            <strong>{ap.city}</strong> ({ap.airport_code})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}