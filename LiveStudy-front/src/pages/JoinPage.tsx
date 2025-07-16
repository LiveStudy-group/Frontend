export default function JoinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
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
            <input type="text" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" placeholder="이메일을 입력해주세요." />
            <button className="middle-button-gray text-body1_M hover:bg-primary-500 hover:text-white">중복확인</button>
          </div>
        </div>
        <div className="w-full">
          <span className="text-caption1_M mb-2">비밀번호</span>
          <input type="text" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" placeholder="패스워드를 입력해주세요."/>
          <p className="mt-2 text-caption2_R text-primary-300">
            * 10자 이상이면서 영문, 숫자, 특수문자를 모두 포함하세요.
          </p>
        </div>
        <div className="w-full">
          <span className="text-caption1_M mb-2">비밀번호 재확인</span>
          <input type="text" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" placeholder="비밀번호를 입력해주세요."/>
          <p className="mt-2 text-caption2_R text-primary-300">
            * 비밀번호를 다시 확인해주세요.
          </p>
        </div>
        <div className="w-full flex gap-2">
          <div>
            <span className="text-caption1_M mb-2">이름</span>
            <input type="text" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" placeholder="이름을 입력해주세요."/>
          </div>
          <div>
            <span className="text-caption1_M mb-2">전화번호</span>
            <input type="text" className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 text-body1_R" placeholder="전화번호를 입력해주세요."/>
          </div>
        </div>
        <div className="w-full space-y-3 my-4">
          {/* 일괄 동의 */}
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="w-4 h-4 appearance-none bg-gray-100 border border-gray-300 rounded checked:bg-primary-500"
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
            />
            <span className="text-caption1_R">[필수] 만 14세 이상입니다.</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 appearance-none bg-gray-100 border border-gray-300 rounded checked:bg-primary-500"
            />
            <span className="text-caption1_R">[필수] 최종이용자 이용약관에 동의합니다.</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 appearance-none bg-gray-100 border border-gray-300 rounded checked:bg-primary-500"
            />
            <span className="text-caption1_R">[필수] 개인정보 수집 및 이용에 동의합니다.</span>
          </label>
        </div>
        <button className="w-full py-4 bg-gray-100 border border-gray-300 rounded-xl font-bold hover:bg-primary-500 hover:text-white">
          가입하기
        </button>
      </section>
    </div>
  )
}