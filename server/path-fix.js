// Path resolution fix for Railway deployment
import { fileURLToPath } from 'url';
import path from 'path';

// Create __dirname equivalent for ES modules
export const getProjectRoot = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '../');
};

// Replace import.meta.dirname with a working alternative for Railway
export const projectRoot = process.env.NODE_ENV === 'production' 
  ? '/app'  // Railway sets working directory to /app
  : getProjectRoot();