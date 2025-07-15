import { Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/Error/NotFoundPage';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/join' element={<JoinPage />} />
      <Route path='/main' element={<MainPage />} />
      <Route path='*' element={<NotFoundPage />} />
      <Route path='test-page' element={<TestPage />} />
    </Routes>
  )
}

export default App
