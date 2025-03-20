import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envPrefix = mode === 'production' ? 'prod' : 'dev';
  const apiUrl = mode === 'production' ? 'https://brlog.site' : 'http://localhost:8090';
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl)
    }
  }
});