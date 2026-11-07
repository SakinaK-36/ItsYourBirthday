import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ContentProvider } from './context/ContentContext';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/sections.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContentProvider>
      <App />
    </ContentProvider>
  </StrictMode>,
);
