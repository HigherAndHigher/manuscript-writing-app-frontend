import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import "./index.css";
import App from "./components/App";

// Create a root using createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render your App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
