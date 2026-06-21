export const configuration = () => ({
  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret-key-change-in-production',
    expiresIn: Number(process.env.JWT_EXPIRY || 3600),
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  server: {
    port: Number(process.env.PORT || 3000),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
});
