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
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/email-login' element={<EmailLoginPage />} />
      <Route path='/join' element={<JoinPage />} />
      <Route path='*' element={<NotFoundPage />} />
      <Route path='test-page' element={<TestPage />} />

      {/* 보호 라우트 */}
      <Route path='/main' element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        } 
      />
      <Route path='studyroom/:id' element={
        <PrivateRoute>
          <StudyRoomPage /> 
        </PrivateRoute>
        } 
      />
      <Route path='/mypage' element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        } 
      />
    </Routes>
  )
}

export default App
