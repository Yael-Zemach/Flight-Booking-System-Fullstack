export const API_ROUTES = {
  BASE: '/api',
  AUTH: {
    BASE: '/api/auth',
    LOGIN: '/login',
    REGISTER: '/register',
  },
  AIRPORTS: {
    BASE: '/api/airports',
    GET_ALL: '/all',
    ADMIN: '/admin',
    ADMIN_BY_ID: '/admin/:id',
    ADMIN_UPDATE_IMAGE: '/admin/:id/image',
  },
  BOOKINGS: {
    BASE: '/api/bookings',
    MY_BOOKINGS: '/my-bookings',
    ADMIN_USER_BOOKINGS: '/admin/user-bookings/:id',
    ADMIN_BOOKING_BY_ID: '/admin/user-bookings/:id/:bookingId',
    ADMIN_UPDATE_BOOKING: '/admin/user-bookings/:id/:bookingId',
  },
  FLIGHTS: {
    BASE: '/api/flights',
    SEARCH: '/search',
    ADMIN: '/admin',
    ADMIN_BY_ID: '/admin/:id',
    ADMIN_CANCEL: '/admin/:id/cancel',
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/profile',
    ADMIN_USER: '/admin/users/:id',
  },
};

export default API_ROUTES;
