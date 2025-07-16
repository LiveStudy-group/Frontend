import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="w-full max-w-sm flex flex-col items-center">
        {/* 로고 */}
        <h1 className="text-headline2_B mb-12 text-primary-500">
          LiveStudy
        </h1>

        {/* 로그인 버튼들 */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full py-4 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-primary-400 hover:text-white">Email 로그인</button>
          <button className="w-full py-4 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-primary-400 hover:text-white">Google 로그인</button>
          <button className="w-full py-4 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-primary-400 hover:text-white">Kakao 로그인</button>
          <button className="w-full py-4 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-primary-400 hover:text-white">Naver 로그인</button>
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