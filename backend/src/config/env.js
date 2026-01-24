import dotenv from 'dotenv'; 
dotenv.config();

 
function reqEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env variable: ${name}`);
    }
    return value;
}

export const env = {
    PORT: Number(process.env.PORT || 5000),
    NODE_ENV: process.env.NODE_ENV || 'development',

    OPENWEATHER_API_KEY: reqEnv('OPENWEATHER_API_KEY'),
    CACHE_TTL_MS: Number(process.env.CACHE_TTL_MS || 300000),

    AUTH0_ISSUER_BASE_URL: reqEnv('AUTH0_ISSUER_BASE_URL'),
    AUTH0_AUDIENCE: reqEnv('AUTH0_AUDIENCE'),

    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};