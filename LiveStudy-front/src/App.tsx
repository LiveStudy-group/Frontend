import { Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/Error/NotFoundPage';
import LandingPage from './pages/LandingPage';
import StudyRoomPage from './pages/StudyRoomPage';
import MainPage from './pages/MainPage';
import TestPage from './pages/TestPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import MyPage from './pages/MyPage';
import EmailLoginPage from './pages/EmailLoginPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='test-page' element={<TestPage />} />
      <Route path='studyroom/:id' element={<StudyRoomPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/email-login' element={<EmailLoginPage />} />
      <Route path='/join' element={<JoinPage />} />
      <Route path='/main' element={<MainPage />} />
      <Route path='/mypage' element={<MyPage />} />
      <Route path='*' element={<NotFoundPage />} />
      <Route path='test-page' element={<TestPage />} />
    </Routes>
  )
}

export default App
