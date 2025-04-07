import { createRoot } from 'react-dom/client'
import './index.css'    // Original index.css Is Removed!!
import App from './App.jsx'  // Original App.css Is Removed!!
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  
      <BrowserRouter>
        <App />
      </BrowserRouter>
  
)
