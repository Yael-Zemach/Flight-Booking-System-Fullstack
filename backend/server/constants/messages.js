export const MESSAGES = {
    AUTH: {
        REGISTRATION_REQUIRED_FIELDS: 'שם, אימייל וסיסמה הם שדות חובה',
        REGISTRATION_SUCCESS: 'הרישום בוצע בהצלחה והתחברת למערכת!',
        EMAIL_ALREADY_EXISTS: 'כתובת האימייל הזו כבר רשומה במערכת',
        REGISTRATION_ERROR: 'שגיאת שרת פנימית בעת הרישום',
        LOGIN_REQUIRED_FIELDS: 'אימייל וסיסמה הם שדות חובה',
        LOGIN_SUCCESS: 'התחברת בהצלחה!',
        EMAIL_NOT_FOUND: 'אימייל לא נמצא',
        PASSWORD_INCORRECT: 'סיסמה שגויה',
        LOGIN_ERROR: 'שגיאת שרת פנימית בעת ההתחברות'
    },
    AUTHORIZATION: {
        PLEASE_LOGIN: 'גישה נדחתה: נא להתחבר למערכת',
        INVALID_OR_EXPIRED_TOKEN: 'הטוקן אינו תקין או שפג תוקפו',
        ADMIN_ONLY: 'גישה נדחתה: פעולה זו מותרת למנהלי מערכת בלבד',
        MISSING_USER_ID: 'מזהה משתמש יעד חסר או לא תקין',
        TARGET_USER_NOT_FOUND: 'המשתמש שאתה מנסה לבצע עבורו פעולה לא קיים',
        ADMIN_CANNOT_MANAGE_ADMIN: 'אין הרשאה לאדמין לבצע פעולה עבור אדמין אחר',
        PERMISSION_DENIED: 'אין לך הרשאה לבצע פעולה זו',
        AUTH_ERROR: 'שגיאת שרת פנימית בבדיקת הרשאות'
    },
    FLIGHTS: {
        TLV_REQUIRED: 'טיסות חייבות להמריא או לנחות ב-TLV.',
        SEARCH_ERROR: 'שגיאה פנימית בעת חיפוש הטיסות.',
        DEPARTURE_TIME_IN_PAST: 'לא ניתן ליצור או לעדכן טיסה עם זמן המראה בעבר.',
        DATE_REQUIRED: 'חובה לספק תאריך (date) כדי לקבל את לוח הטיסות.',
        CREATE_SUCCESS: 'הטיסה נוצרה בהצלחה',
        UPDATE_SUCCESS: 'הטיסה עודכנה בהצלחה',
        CANCEL_SUCCESS: 'הטיסה בוטלה בהצלחה וכל ההזמנות הקשורות עודכנו',
        NOT_FOUND: 'הטיסה לא נמצאה',
        MISSING_DATA: 'חסרים נתוני טיסה',
        INVALID_AIRPORTS: 'שדה התעופה של ההמראה והנחיתה לא יכולים להיות זהים',
        INVALID_DATES: 'תאריך הנחיתה חייב להיות אחרי תאריך ההמראה',
        ALREADY_CANCELLED: 'הטיסה כבר מבוטלת'
    },
    USERS: {
        UPDATE_SUCCESS: 'הפרטים עודכנו בהצלחה',
        UPDATE_FAILED: 'עדכון הפרטים נכשל',
        UPDATE_ERROR: 'שגיאה בעדכון הנתונים'
    },
        BOOKINGS: {
        MISSING_DATA: 'חסרים נתוני טיסה או נוסעים',
        CREATE_SUCCESS: 'ההזמנה בוצעה בהצלחה',
        CANCEL_SUCCESS: 'ההזמנה בוטלה בהצלחה',
        NOT_FOUND: 'ההזמנה לא נמצאה במערכת',
        NOT_FOUND_OR_CANCELLED: 'ההזמנה לא נמצאה או שכבר בוטלה',
        INVALID_STATUS: 'סטטוס לא תקין לעדכון הזמנה',
        ALREADY_CANCELLED: 'ההזמנה כבר מבוטלת',
        NOT_YOUR_BOOKING: 'אין לך הרשאה לבטל הזמנה זו',
        CANNOT_CANCEL_24_HOURS: 'לא ניתן לבטל טיסה פחות מ-24 שעות לפני מועד ההמראה',
        ADMIN_UPDATE_SUCCESS: 'ההזמנה והנוסעים עודכנו בהצלחה',
        ADMIN_UPDATE_FAILED: 'עדכון ההזמנה נכשל'
    },
    AIRPORTS: {
        CREATE_SUCCESS: 'שדה התעופה נוצר בהצלחה',
        UPDATE_IMAGE_SUCCESS: 'תמונת שדה התעופה עודכנה בהצלחה',
        UPDATE_IMAGE_FAILED: 'עדכון תמונת שדה התעופה נכשל',
        DELETE_SUCCESS: 'שדה התעופה נמחק בהצלחה',
        NOT_FOUND: 'שדה התעופה לא נמצא',
        MISSING_DATA: 'חסרים נתוני שדה תעופה או קישור לתמונה',
        CODE_ALREADY_EXISTS: 'קוד שדה התעופה (Airport Code) כבר קיים במערכת',
        CANNOT_DELETE_HAS_FLIGHTS: 'לא ניתן למחוק שדה תעופה: קיימות טיסות פעילות המשויכות לשדה זה'
    },
    SERVER: {
        INTERNAL_ERROR: 'Internal Server Error'
    }
};
