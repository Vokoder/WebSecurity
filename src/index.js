import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.css'
import App from './App'
import './style/bootstrap.css'

const app = ReactDOM.createRoot(document.getElementById('app'));
app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);