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
    }
};
