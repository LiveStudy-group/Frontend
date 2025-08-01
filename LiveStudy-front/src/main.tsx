import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css';
import { BrowserRouter } from 'react-router-dom';

(async () => {
  if(process.env.NODE_ENV === 'development') {
  const { worker } = await import('./mocks/browser.ts')
  worker.start()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)})()
