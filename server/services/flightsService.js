import { getFlightsByDateRange } from '../models/flightsModel.js';

// פונקציית עזר להוספה/החסרה של ימים לתאריך
const addDays = (dateStr, days) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // מחזיר פורמט YYYY-MM-DD
};

// פונקציית עזר לבדיקת החוק שלך: מינימום 3 שעות בין נחיתה להמראה
const isValidConnection = (outboundFlight, inboundFlight) => {
    const outArrival = new Date(outboundFlight.arrival_time).getTime();
    const inDepart = new Date(inboundFlight.departure_time).getTime();
    
    const hoursDiff = (inDepart - outArrival) / (1000 * 60 * 60);
    return hoursDiff >= 3;
};

export async function findRelevantFlights(tripType, origin, dest, departDate, returnDate, passengers) {
    let isFlexibleSearch = false; // דגל שיגיד ל-React אם זו תוצאה מדויקת או חלופית
    
    // 1. ניסיון חיפוש לתאריכים המדויקים
    let outbound = await getFlightsByDateRange(origin, dest, departDate, departDate, passengers);
    let inbound = [];
    
    if (tripType === 'round-trip' && returnDate) {
        inbound = await getFlightsByDateRange(dest, origin, returnDate, returnDate, passengers);
    }

    // 2. בדיקה אם מצאנו תוצאות מדויקות ואם הן לא סותרות אחת את השנייה
    let hasExactResults = outbound.length > 0 && (tripType === 'one-way' || inbound.length > 0);
    
    // אם יש לנו תוצאות מדויקות בהלוך-חזור, נפעיל את חוק ה-3 שעות
    if (hasExactResults && tripType === 'round-trip') {
        outbound = outbound.filter(out => inbound.some(inb => isValidConnection(out, inb)));
        inbound = inbound.filter(inb => outbound.some(out => isValidConnection(out, inb)));
        
        // אם אחרי הסינון לא נשארו טיסות (כי כולם התנגשו בשעות), נגדיר שאין תוצאות מדויקות
        if (outbound.length === 0 || inbound.length === 0) {
            hasExactResults = false;
        }
    }

    // 3. אלגוריתם חיפוש גמיש (אם אין תוצאות מדויקות)
    if (!hasExactResults) {
        // בדיקת חוק טיול קצר: אם זה הלוך-חזור בהפרש של יומיים או פחות - אין טעם לחפש גמיש
        let allowFlexible = true;
        if (tripType === 'round-trip' && returnDate) {
            const departTime = new Date(departDate).getTime();
            const returnTime = new Date(returnDate).getTime();
            const daysDiff = (returnTime - departTime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff <= 2) {
                allowFlexible = false;
            }
        }

        if (allowFlexible) {
            isFlexibleSearch = true; // נדליק את הדגל עבור ה-React
            
            // הגדרת טווח החיפוש החדש: יומיים אחורה עד יומיים קדימה
            const flexDepartStart = addDays(departDate, -2);
            const flexDepartEnd = addDays(departDate, 2);
            
            outbound = await getFlightsByDateRange(origin, dest, flexDepartStart, flexDepartEnd, passengers);

            if (tripType === 'round-trip' && returnDate) {
                const flexReturnStart = addDays(returnDate, -2);
                const flexReturnEnd = addDays(returnDate, 2);
                
                inbound = await getFlightsByDateRange(dest, origin, flexReturnStart, flexReturnEnd, passengers);
                
                // הליבה של מניעת הסתירות: סינון המערכים הגמישים לפי חוק ה-3 שעות
                // אנחנו שומרים רק טיסות הלוך שיש להן לפחות טיסת חזור אחת שתואמת להן ולהפך!
                outbound = outbound.filter(out => inbound.some(inb => isValidConnection(out, inb)));
                inbound = inbound.filter(inb => outbound.some(out => isValidConnection(out, inb)));
            }
        } else {
            // אם החיפוש הגמיש נחסם בגלל הפרש קטן מיומיים
            outbound = [];
            inbound = [];
        }
    }

    // 4. החזרת האובייקט המסכם לקונטרולר ול-React
    return {
        isFlexible: isFlexibleSearch,
        outbound: outbound,
        inbound: inbound
    };
}