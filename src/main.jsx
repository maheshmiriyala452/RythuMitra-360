import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap 5 & Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Custom Design System Tokens & Global CSS
import './styles/main.css';
import './styles/sidebar.css';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
