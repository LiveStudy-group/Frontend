import { Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/Error/NotFoundPage';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='test-page' element={<TestPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
