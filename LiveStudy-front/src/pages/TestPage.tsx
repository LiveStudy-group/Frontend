import Footer from "../components/common/Footer";
import Header from "../components/common/Header";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <h1 className="text-headline1_B">Headline 1 스타일</h1>
      <h2 className="text-headline2_B">Headline 2 스타일</h2>
      <h3 className="text-headline3_B">Headline 3 스타일</h3>

      <p className="text-body1_M text-primary-500 font-bold">본문 Body1 스타일입니다.</p>
      <p className="text-body1_R text-primary-500">본문 Body2 스타일입니다.</p>
      <p className="text-caption1_SB">캡션 스타일입니다.</p>

      <div className="space-x-4">
        <button className="max-button-primary">기본 Primary 버튼</button>
        <button className="middle-button-gray">Secondary 버튼</button>
        <button className="middle-button-white" disabled>
          비활성화 버튼
        </button>
      </div>
      <Footer />
    </div>
  );
}