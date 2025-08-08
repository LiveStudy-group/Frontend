import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import BlockTestPage from './components/test/TestMessagePage';
import TestPage from './components/test/TestPage';
import ChatTestPage from './pages/ChatTestPage';
import EmailLoginPage from './pages/EmailLoginPage';
import NotFoundPage from './pages/Error/NotFoundPage';
import JoinPage from './pages/JoinPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import MessageTestPage from './pages/MessageTestPage';
import MyPage from './pages/MyPage';
import Redirection from './pages/Redirection';
import StudyRoomPage from './pages/StudyRoomPage';
import PrivateRoute from './routes/PrivateRoute';
import { useAuthStore } from './store/authStore';


function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // 앱 시작 시 토큰 자동 복원
  useEffect(() => {
    initializeAuth?.();
    console.log('🔐 인증 시스템 초기화 완료');
  }, [initializeAuth]);

  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/email-login' element={<EmailLoginPage />} />
      <Route path='/join' element={<JoinPage />} />
      <Route path='/test-page' element={<TestPage />} />
      <Route path='/block-test-page' element={<BlockTestPage />} />
      <Route path='/chat-test' element={<ChatTestPage />} />
      <Route path='/message-test' element={<MessageTestPage />} />
      <Route path='*' element={<NotFoundPage />} />
      <Route path="/kakao/callback" element={<Redirection />} />

      {/* 보호 라우트 */}
      <Route
        path='/main'
        element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/studyroom/:roomId"
        element={
          <PrivateRoute>
            <StudyRoomPage />
          </PrivateRoute>
        }
      />
      
      <Route
        path='/mypage'
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
