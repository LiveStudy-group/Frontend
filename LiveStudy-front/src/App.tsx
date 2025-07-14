import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='test-page' element={<TestPage />} />
    </Routes>
  )
}

export default App
