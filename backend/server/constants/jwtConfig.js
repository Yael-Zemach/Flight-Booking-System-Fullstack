export const JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET || 'your_super_secret_key',
    EXPIRATION: '3h'
};
