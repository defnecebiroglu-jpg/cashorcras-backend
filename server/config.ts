// Server configuration and environment variables
export const config = {
  // Server
  PORT: parseInt(process.env.PORT || '5000', 10),
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || 'cashcrash-secret-key-' + Math.random(),
  SESSION_SECURE: process.env.NODE_ENV === 'production' && process.env.HTTPS !== 'false',
  
  // Object Storage
  DEFAULT_OBJECT_STORAGE_BUCKET_ID: process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID,
  PRIVATE_OBJECT_DIR: process.env.PRIVATE_OBJECT_DIR,
  PUBLIC_OBJECT_SEARCH_PATHS: process.env.PUBLIC_OBJECT_SEARCH_PATHS,
  
  // Development
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Deployment detection
  isRender: !!process.env.RENDER,
  isRailway: !!process.env.RAILWAY_ENVIRONMENT,
  isReplit: !!process.env.REPL_ID,
};

// Validate required environment variables for production
if (config.isProduction) {
  const required = ['SESSION_SECRET'];
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`Warning: ${key} environment variable not set in production`);
    }
  }
}

export default config;