import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global fetch interceptor for Session Expiration
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const response = await originalFetch(...args);
  
  if (response.status === 401 || response.status === 403) {
    // Clone response so we can read JSON without consuming the original stream
    const clone = response.clone();
    try {
      const data = await clone.json();
      if (response.status === 401 || (response.status === 403 && data.error === 'Invalid or expired token')) {
        // Only trigger logout if it's explicitly a token issue or general 401 Unauthenticated
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/login';
      }
    } catch (e) {
      if (response.status === 401) {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  }
  return response;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
