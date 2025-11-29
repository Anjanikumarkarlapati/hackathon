import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // It is okay if this file is empty

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  // If we see this in the console, we know the HTML is wrong
  console.error("FATAL ERROR: Could not find the root element. Check your index.html file.");
  document.body.innerHTML = "<div style='color: red; padding: 20px;'>Error: Root element not found. Check console.</div>";
}