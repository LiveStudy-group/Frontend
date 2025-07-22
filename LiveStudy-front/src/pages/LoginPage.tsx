import { Link } from "react-router-dom"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <section className="w-full max-w-sm flex flex-col items-center">
        {/* 로고 */}
        <div className="mb-12">
          <h1 className="text-headline2_B mb-2 text-primary-500 text-center">
            LiveStudy
          </h1>
          <p className="text-body1_R text-gray-500 whitespace-nowrap">
            전국의 모든 친구들과, 집중하는 공부를 시작해보세요.
          </p>
        </div>

        {/* 로그인 버튼들 */}
        <div className="w-full flex flex-col gap-3">
          <button className="w-full py-3 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-gray-200">
            <Link to={'/email-login'}>Email 로그인</Link>
          </button>
          <button className="w-full py-3 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-gray-200">Google 로그인</button>
          <button className="w-full py-3 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-gray-200">Kakao 로그인</button>
          <button className="w-full py-3 bg-gray-100 border border-gray-300 rounded-xl text-body1_R text-gray-500 hover:bg-gray-200">Naver 로그인</button>
        </div>
      </section>
    </div>
  )
}