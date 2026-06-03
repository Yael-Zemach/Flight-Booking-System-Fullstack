export const API_ROUTES = {
    BASE: '/api',
    AUTH: {
        REGISTER: '/register',
        LOGIN: '/login'
    },
    FLIGHTS: {
        SEARCH: '/search'
    },
    USERS: {
        PROFILE: '/profile',
        ADMIN_USER: '/admin/users/:id'
    },
    BOOKINGS: {
        MY_BOOKINGS: '/my-bookings',
        MY_BOOKINGS_CANCEL: '/my-bookings/:bookingId/cancel', // נתיב מלא בקבוע
        ADMIN_USER_BOOKINGS: '/admin/user-bookings/:id',
        ADMIN_CANCEL_BOOKING: '/admin/user-bookings/:id/:bookingId/cancel', // נתיב מלא לאדמין
        ADMIN_UPDATE_BOOKING: '/admin/user-bookings/:id/:bookingId' // נתיב מלא לעדכון
    },
    FLIGHTS: {
        SEARCH: '/search', // קיים אצלך
        ADMIN_FLIGHTS: '/admin/flights', // נתיב ליצירת טיסה
        ADMIN_FLIGHT_BY_ID: '/admin/flights/:id' ,// נתיב לעדכון ומחיקת טיסה
        ADMIN_CANCEL_FLIGHT: '/admin/flights/:id/cancel' // ביטול טיסה
    },
    AIRPORTS: {
        GET_ALL: '/allairports', // הנתיב הציבורי החדש
        ADMIN_AIRPORTS: '/admin/airports', // נתיב ליצירת שדה תעופה
        ADMIN_AIRPORT_BY_ID: '/admin/airports/:id', // נתיב למחיקה
        ADMIN_UPDATE_IMAGE: '/admin/airports/:id/image' // נתיב לעדכון תמונה בלבד
    }
};

