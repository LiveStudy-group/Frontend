import { FiClock, FiMessageCircle, FiUsers, FiVideo } from "react-icons/fi";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <Header />
      <section className="relative w-full h-[700px]">
        {/* 배너 정보 */}
        <div className="max-w-[1280px] w-full absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center z-50">
          <h1 className="text-headline1_B text-white text-center">
            함께하는 루틴으로, 몰입감있는 공부를
          </h1>
          <p className="text-white text-center mt-4 mb-12">
            전국의 모든 친구들과, 집중하는 공부를 시작해보세요.
          </p>
          <button className="max-round-button-white text-primary-500 hover:bg-primary-500 hover:text-white text-headline4_B">
            <Link to={'/login'}>지금 시작하기</Link>
          </button>
        </div>
        {/* 딤처리 */}
        <div className="absolute inset-0 bg-black opacity-50 z-10" />
        {/* 배너 이미지 */}
        <img src="/public/img/landing-page-banner-1.jpg" alt="랜딩페이지 배너 이미지" className="absolute w-full h-full object-cover top-0 z-0" />
      </section>
      <section className="max-w-[1280px] w-full m-auto flex flex-col py-16">
        <h2 className="text-headline2_B mb-4 text-center"><span className="text-primary-500">LiveStudy</span> 는 이런 서비스에요</h2>
        <p className="mx-auto text-gray-500">
          영상 공유, 채팅, 포모도로 타이머, 집중 유도 디자인 등 혼자서 어려웠던 집중을 함께 만들어가는 온라인 스터디룸 플랫폼입니다.
        </p>
        <article className="flex justify-center gap-6 p-16">
          <div className="flex flex-col flex-1 max-w-[240px] items-center p-9 bg-gray-50 rounded-lg">
            <FiVideo className="w-12 h-12 text-primary-500 mb-6" />
            <p className="text-gray-500">실시간 영상 공유</p>
          </div>
          <div className="flex flex-col flex-1 max-w-[240px] items-center p-9 bg-gray-50 rounded-lg">
            <FiMessageCircle className="w-12 h-12 text-primary-500 mb-6" />
            <p className="text-gray-500">채팅 & 화이트보드</p>
          </div>
          <div className="flex flex-col flex-1 max-w-[240px] items-center p-9 bg-gray-50 rounded-lg">
            <FiClock className="w-12 h-12 text-primary-500 mb-6" />
            <p className="text-gray-500">포모도로 타이머</p>
          </div>
          <div className="flex flex-col flex-1 max-w-[240px] items-center p-9 bg-gray-50 rounded-lg">
            <FiUsers className="w-12 h-12 text-primary-500 mb-6" />
            <p className="text-gray-500">스터디룸 참여</p>
          </div>
        </article>
      </section>
      <section className="w-full py-24 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-headline2_B text-center text-gray-700 mb-16">
            어떻게 사용하나요?
          </h2>

          <ul className="flex flex-col gap-12">
            {/* Step 1 */}
            <li className="flex flex-col md:flex-row items-center gap-6">
              <img src="/img/feature-join-room.png" alt="방 입장" className="w-[280px] h-[180px] object-cover rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="text-headline3_B mb-2">1. 랜덤 스터디룸에 입장</h3>
                <p className="text-gray-500">
                  ‘스터디 시작하기’ 버튼을 누르면 자동으로 스터디룸에 입장해요.<br />
                  카메라 사용 동의를 하면 입장이 완료됩니다.
                </p>
              </div>
            </li>

            {/* Step 2 */}
            <li className="flex flex-col md:flex-row-reverse items-center gap-6">
              <img src="/img/feature-mic-off.png" alt="마이크 꺼짐 상태" className="w-[280px] h-[180px] object-cover rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="text-headline3_B mb-2 text-right">2. 마이크 OFF, 조용히 집중 시작</h3>
                <p className="text-gray-500 text-right">
                  입장하면 마이크는 자동으로 꺼져요.<br />
                  공부할 준비가 되면 직접 타이머를 시작할 수 있어요.
                </p>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex flex-col md:flex-row items-center gap-6">
              <img src="/img/feature-timer.png" alt="타이머 시작" className="w-[280px] h-[180px] object-cover rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="text-headline3_B mb-2">3. 자동 타이머로 몰입</h3>
                <p className="text-gray-500">
                  타이머는 방 입장과 동시에 시작되고,<br />
                  휴식 시간에는 상태를 전환하여 타이머를 멈출 수 있어요.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="text-center mt-16">
          <button
            onClick={() => window.location.href = '/auth/join'} // 또는 router.push('/auth/join') 사용도 가능
            className="max-round-button-primary duration-300 hover:bg-white hover:text-primary-400 text-headline4_B"
          >
            <Link to={'/login'}>지금 가입하고 시작하기</Link>
          </button>
        </div>
      </section>
      <Footer />
    </div>
  )
}