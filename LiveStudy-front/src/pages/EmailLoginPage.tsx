import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../lib/api/auth";
import { useAuthStore } from "../store/authStore";

export default function EmailLoginPage() {
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')
  
  const navigate = useNavigate()
  const setLogin = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    if(!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.')
      return;
    }

    try {
      const response = await loginApi({ email, password });
      const { uid, email: userEmail, username, token } = response;
      setLogin({ uid, email: userEmail, username }, token);
      alert(`환영합니다 ! ${username}님`)
      navigate('/main');
    } catch (error) {
      alert(error || '로그인에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <section className="w-full max-w-sm flex flex-col items-center">
        <div className="mb-12">
          <h1 className="text-headline2_B mb-2 text-primary-500 text-center">
            <Link to={'/'}>LiveStudy</Link>
          </h1>
          <p className="text-body1_R text-gray-500 whitespace-nowrap">
            가입한 이메일과 패스워드를 입력해주세요.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="이메일을 입력해주세요."
            className="text-body1_R w-full px-6 py-3 border border-gray-300 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="password" 
            placeholder="비밀번호를 입력해주세요."
            className="text-body1_R w-full px-6 py-3 border border-gray-300 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button 
            type="submit" 
            className="basic-button-primary py-3 text-white border border-gray-300 hover:bg-primary-600"
            onClick={handleLogin}
          >
            로그인
          </button>
        </div>
        
        <div className="flex items-center mt-3 gap-3 w-full">
          <span className="flex-1 h-px bg-gray-300" />
          <Link to="/login" className="text-body1_R text-gray-500 whitespace-nowrap">
            이전으로
          </Link>
          <span className="flex-1 h-px bg-gray-300" />
        </div>

        {/* ID/PW 찾기 & 회원가입 */}
        <div className="w-full flex justify-between text-body1_R text-gray-500 mt-4">
          <button>ID/Password 찾기</button>
          <button>
            <Link to={'/join'}>회원가입</Link>
          </button>
        </div>
      </section>
    </div>
  )
}