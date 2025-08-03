import { useState } from "react"
import { signUp } from "../lib/api/auth"
import { useNavigate } from "react-router-dom"
import { checkDuplicateEmail } from "../mocks/handlers"
import type { AxiosError } from "axios"
import { Link } from "react-router-dom"

export default function JoinPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repassword, setRepassword] = useState('')
  const [nickname, setNickname] = useState('')
  // const [phone, setPhone] = useState('')

  const [agreeAll, setAgreeAll] = useState(false)
  const [agreements, setAgreements] = useState({
    age: false,
    terms: false,
    privacy: false,
  })

  const navigate = useNavigate()

  const handleCheckEmail = async () => {
    try {
      await checkDuplicateEmail(email);
      alert('사용 가능한 이메일입니다.');
    } catch (error) {
      const err = error as AxiosError<{message: string}>;
      alert(err.response?.data?.message || '중복된 이메일입니다.')
    }
  }

  const isValidPassword = (password: string): boolean => {
    // 최소 8자, 영문 + 숫자 + 특수문자 조합
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    if (!email || !password || !repassword || !nickname) {
      alert('모든 필드를 입력해주세요.');
      return false;
    }
    if (!agreements.age || !agreements.terms || !agreements.privacy) {
      alert('필수 약관에 모두 동의해주세요.');
      return false;
    }
    if (password !== repassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (!isValidPassword(password)) {
      alert('비밀번호는 8자 이상이면서, 영문자/숫자/특수문자를 모두 포함해야합니다.')
      return false;
    }
    return true;
  };

  const handleAgreeAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAgreeAll(checked);
    setAgreements({
      age: checked,
      terms: checked,
      privacy: checked,
    });
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    const updated = {
      ...agreements,
      [name]: checked,
    };
    setAgreements(updated);

    // 모두 true면 agreeAll도 true
    const allChecked = Object.values(updated).every((v) => v === true);
    setAgreeAll(allChecked);
  };

  const handleJoin = async () => {
    if(!validateForm()) return;

    try {
      await signUp({ email, password, repassword, nickname})
      alert('회원가입 성공! 로그인 페이지로 이동합니다.')
      navigate('/email-login')
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      alert(err.response?.data?.message || '회원가입 실패')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <section className="w-full max-w-sm flex flex-col items-center gap-3">
        <div className="w-full flex flex-col gap-2 mb-6">
          <h2 className="text-headline2_B text-center">
            가입을 환영합니다 !
          </h2>
          <p className="text-caption1_R text-center">
            온라인 공부방 LiveStudy에 지금 가입해보세요.
          </p>
        </div>
        <div className="w-full">
          <span className="text-caption1_M mb-2">이메일</span>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" 
              placeholder="이메일을 입력해주세요." 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              className="middle-button-gray text-body1_M border border-gray-300 hover:bg-primary-500 hover:text-white"
              onClick={handleCheckEmail}
            >
                중복확인
            </button>
          </div>
        </div>
        <div className="w-full">
          <span className="text-caption1_M mb-2">비밀번호</span>
          <input 
            type="password" 
            className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" 
            placeholder="패스워드를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-2 text-caption2_R text-primary-300">
            * 8자 이상이면서 영문, 숫자, 특수문자를 모두 포함하세요.
          </p>
        </div>
        <div className="w-full">
          <span className="text-caption1_M mb-2">비밀번호 재확인</span>
          <input 
            type="password" 
            className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" 
            placeholder="비밀번호를 입력해주세요."
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
          />
          <p className="mt-2 text-caption2_R text-primary-300">
            * 비밀번호를 다시 확인해주세요.
          </p>
        </div>
        <div className="w-full">
          <div>
            <span className="text-caption1_M mb-2">이름</span>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" 
              placeholder="이름을 입력해주세요."
                          value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          {/* <div>
            <span className="text-caption1_M mb-2">전화번호</span>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" 
              placeholder="전화번호를 입력해주세요."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div> */}
        </div>
        <div className="w-full space-y-3 my-4">
          {/* 일괄 동의 */}
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="w-4 h-4 appearance-none bg-gray-100 border border-gray-300 rounded checked:bg-primary-500"
              checked={agreeAll}
              onChange={handleAgreeAllChange}
            />
            <span className="text-caption1_R">
              모두 동의합니다.
            </span>
          </label>
          <hr className="border-gray-300" />
          {/* 개별 항목 */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 appearance-none bg-gray-100 border border-gray-300 rounded checked:bg-primary-500"
              name="age"
              checked={agreements.age}
              onChange={handleAgreementChange}
            />
            <span className="text-caption1_R">[필수] 만 14세 이상입니다.</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 appearance-none bg-gray-100 border border-gray-300 rounded checked:bg-primary-500"
              name="terms"
              checked={agreements.terms}
              onChange={handleAgreementChange}
            />
            <span className="text-caption1_R">[필수] 최종이용자 이용약관에 동의합니다.</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 appearance-none bg-gray-100 border border-gray-300 rounded checked:bg-primary-500"
              name="privacy"
              checked={agreements.privacy}
              onChange={handleAgreementChange}
            />
            <span className="text-caption1_R">[필수] 개인정보 수집 및 이용에 동의합니다.</span>
          </label>
        </div>

        <button 
          type="submit"
          className="w-full py-3 bg-gray-100 border border-gray-300 rounded-xl font-bold hover:bg-primary-500 hover:text-white"
          onClick={handleJoin}
        >
          가입하기
        </button>

        <div className="flex items-center mt-3 gap-3 w-full">
          <span className="flex-1 h-px bg-gray-300" />
          <Link to="/email-login" className="text-body1_R text-gray-500 whitespace-nowrap">
            이전으로
          </Link>
          <span className="flex-1 h-px bg-gray-300" />
        </div>
      </section>
    </div>
  )
}