import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initDB } from './lib/db';
import { initializeAdmin } from './services/auth';

// Initialize the database and create admin user
async function init() {
  await initDB();
  await initializeAdmin();
}

init().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});