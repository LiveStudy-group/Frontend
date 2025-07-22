import { useState } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FiChevronDown } from "react-icons/fi";

const titles = ['🥕 꾸준함의 씨앗', '🔥 불타는 집중왕', '🏋🏼‍♂️ 철인 집중력', '📚 스터디 마스터']

export default function MyPage() {
  const [selectedTitle, setSelectedTitle] = useState(titles[0])

  return (
    <div className="w-full">
      <Header />
      <section className="max-w-[1280px] h-[calc(100vh-100px)] m-auto p-6">
        <h1 className="text-headline3_B">마이페이지</h1>
        <div className="flex flex-col gap-6 pt-6">
          <h2 className="font-semibold">유저 정보</h2>

          <hr className="border-gray-100" />

          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M">프로필 이미지</h3>
            </div>
            <div className="flex-1">
              <img src="/public/img/my-page-profile-image-1.jpg" alt="프로필 이미지" className="w-10 h-10w-10 bg-gray-300 rounded-full border border-gray-300" />
            </div>
            <button className="basic-button-gray hover:bg-gray-200 text-body1_R">
              프로필 이미지 변경
            </button>
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M">유저 닉네임</h3>
            </div>
            <div className="flex-1">
              <p className="text-caption1_M text-primary-500">홍길동</p>
            </div>
            <button className="basic-button-gray hover:bg-gray-200 text-body1_R">
              닉네임 변경
            </button>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M ">이메일 주소</h3>
            </div>
            <div className="flex-1">
              <p className="text-caption1_M text-primary-500">bosv031999@gmail.com</p>
            </div>
            <button className="basic-button-gray hover:bg-gray-200 text-body1_R">
              이메일 변경
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="min-w-[112px] text-body1_M ">비밀번호</h3>
            </div>
            <button className="basic-button-gray hover:bg-gray-200 text-body1_R">
              비밀번호 변경
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-12">
          <h2 className="text-base font-semibold">칭호 및 업적</h2>

          <hr className="border-gray-100" />
          
          <div className="flex justify-between items-center gap-3 sm:gap-6">
            <label className="min-w-[112px] text-body1_M">칭호</label>
            <div className="relative w-full sm:w-64">
              <select
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                className="w-full appearance-none bg-gray-100 border border-gray-300 text-body1_M px-4 py-2 rounded-md shadow-inner focus:ring-2 focus:ring-primary-400 focus:outline-none"
              >
                {titles.map((title, idx) => (
                  <option key={idx} value={title}>
                    {title}
                  </option>
                ))}
              </select>

              {/* Dropdown Icon (오른쪽 아이콘) */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <FiChevronDown />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-3 sm:gap-6">
            <h3 className="min-w-[112px] text-body1_M">누적 집중시간</h3>
            <button className="basic-button-gray">
              31시간
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}