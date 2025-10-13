import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './styles/global.css'
import './styles/users.css'

console.log('MAIN ACTUALIZADO TIMESTAMP: 040954');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
