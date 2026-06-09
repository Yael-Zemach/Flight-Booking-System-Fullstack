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
        MY_BOOKINGS_CANCEL: '/my-bookings/:bookingId/cancel',
        MY_BOOKINGS_PAY: '/my-bookings/:bookingId/pay', // 🌟 הראוט החדש לתשלום הלקוח // נתיב מלא בקבוע
        ADMIN_USER_BOOKINGS: '/admin/user-bookings/:id',
        ADMIN_CANCEL_BOOKING: '/admin/user-bookings/:id/:bookingId/cancel', // נתיב מלא לאדמין
        ADMIN_UPDATE_BOOKING: '/admin/user-bookings/:id/:bookingId' // נתיב מלא לעדכון
    },
    FLIGHTS: {
        SEARCH: '/search', // public search -> /api/flights/search
        ADMIN_FLIGHTS: '/admin', // admin create -> /api/flights/admin
        ADMIN_FLIGHT_BY_ID: '/admin/:id', // admin update/delete -> /api/flights/admin/:id
        ADMIN_CANCEL_FLIGHT: '/admin/:id/cancel' // admin cancel -> /api/flights/admin/:id/cancel
    },
    AIRPORTS: {
        GET_ALL: '/all', // public list of airports -> results in /api/airports/all
        ADMIN_AIRPORTS: '/admin', // create airport -> /api/airports/admin
        ADMIN_AIRPORT_BY_ID: '/admin/:id', // delete/update by id -> /api/airports/admin/:id
        ADMIN_UPDATE_IMAGE: '/admin/:id/image' // update image -> /api/airports/admin/:id/image
    }
};

