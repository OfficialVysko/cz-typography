import React from 'react';
import { createRoot } from 'react-dom/client';
import { TypoWrapper } from 'cz-typography/react';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <TypoWrapper mode="dom">
            <App />
        </TypoWrapper>
    </React.StrictMode>,
);
