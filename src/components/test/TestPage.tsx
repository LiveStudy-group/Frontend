// import { useState } from "react";
// import Footer from "../components/common/Footer";
// import Header from "../components/common/Header";
// import MessageButton from "../components/MessageButton";
// import MessageModal from "../components/MessageModal";
import { useEffect, useState } from "react";
import {
  checkEmailDuplicate,
  testConnection,
  testGetTodayStudyTime,
  testGetUserProfile,
  testGetUserTitles,
  testLoginDemo as testLogin,
  testSignupDemo as testSignup,
  testUpdateEmail,
  testUpdateNickname,
  testUpdatePassword,
  testUpdateProfileImage,
  testUpdateRepresentTitle
} from "../../lib/api/auth";

// 테스트 결과 타입 정의
interface TestResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

interface TestResults {
  connection?: TestResult;
  login?: TestResult;
  signup?: TestResult;
  checkEmailDuplicate?: TestResult;
  updateNickname?: TestResult;
  updateEmail?: TestResult;
  updatePassword?: TestResult;
  updateProfileImage?: TestResult;
  getUserProfile?: TestResult;
  getUserTitles?: TestResult;
  updateRepresentTitle?: TestResult;
  getTodayStudyTime?: TestResult;
}

export default function TestPage() {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);
  
  // 1. 기본 연결 테스트
  const handleConnectionTest = async () => {
    setLoading(true);
    try {
      const result = await testConnection();
      console.log("✅ 기본 연결 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, connection: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 기본 연결 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '연결 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, connection: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 2. 로그인 API 테스트
  const handleLoginTest = async () => {
    setLoading(true);
    try {
      const result = await testLogin();
      console.log("✅ 로그인 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, login: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 로그인 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '로그인 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, login: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

    // 3. 회원가입 API 테스트
  const handleSignupTest = async () => {
    setLoading(true);
    try {
      const result = await testSignup();
      console.log("✅ 회원가입 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, signup: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 회원가입 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '회원가입 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, signup: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 3-1. 이메일 중복확인 API 테스트
  const handleEmailDuplicateTest = async () => {
    setLoading(true);
    try {
      // 사용 가능한 이메일과 중복된 이메일 둘 다 테스트
      const testEmail1 = 'newuser@example.com';
      const testEmail2 = 'existing@example.com';
      
      const result1 = await checkEmailDuplicate(testEmail1);
      const result2 = await checkEmailDuplicate(testEmail2);
      
      const testResult = {
        available_email: { email: testEmail1, result: result1 },
        duplicate_email: { email: testEmail2, result: result2 }
      };
      
      console.log("✅ 이메일 중복확인 API 성공:", testResult);
      setTestResults((prev: TestResults) => ({ 
        ...prev, 
        checkEmailDuplicate: { success: true, data: testResult } 
      }));
    } catch (error: unknown) {
      console.error("❌ 이메일 중복확인 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '이메일 중복확인 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ 
        ...prev, 
        checkEmailDuplicate: { success: false, error: errorMessage } 
      }));
    }
    setLoading(false);
  };

  // 4. 닉네임 변경 API 테스트
  const handleNicknameTest = async () => {
    setLoading(true);
    try {
      const result = await testUpdateNickname();
      console.log("✅ 닉네임 변경 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, updateNickname: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 닉네임 변경 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '닉네임 변경 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, updateNickname: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 5. 이메일 변경 API 테스트
  const handleEmailTest = async () => {
    setLoading(true);
    try {
      const result = await testUpdateEmail();
      console.log("✅ 이메일 변경 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, updateEmail: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 이메일 변경 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '이메일 변경 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, updateEmail: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 6. 비밀번호 변경 API 테스트
  const handlePasswordTest = async () => {
    setLoading(true);
    try {
      const result = await testUpdatePassword();
      console.log("✅ 비밀번호 변경 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, updatePassword: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 비밀번호 변경 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '비밀번호 변경 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, updatePassword: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 7. 프로필 이미지 변경 API 테스트
  const handleProfileImageTest = async () => {
    setLoading(true);
    try {
      const result = await testUpdateProfileImage();
      console.log("✅ 프로필 이미지 변경 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, updateProfileImage: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 프로필 이미지 변경 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '프로필 이미지 변경 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, updateProfileImage: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };
  
  // 8. 프로필 조회 API 테스트
  const handleProfileTest = async () => {
    setLoading(true);
    try {
      const result = await testGetUserProfile();
      console.log("✅ 프로필 조회 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, getUserProfile: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 프로필 조회 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '프로필 조회 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, getUserProfile: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 9. 칭호 목록 조회 API 테스트
  const handleTitlesTest = async () => {
    setLoading(true);
    try {
      const result = await testGetUserTitles();
      console.log("✅ 칭호 목록 조회 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, getUserTitles: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 칭호 목록 조회 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '칭호 목록 조회 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, getUserTitles: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 10. 대표 칭호 변경 API 테스트
  const handleRepresentTitleTest = async () => {
    setLoading(true);
    try {
      const result = await testUpdateRepresentTitle();
      console.log("✅ 대표 칭호 변경 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, updateRepresentTitle: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 대표 칭호 변경 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '대표 칭호 변경 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, updateRepresentTitle: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 11. 오늘 공부 시간 조회 API 테스트
  const handleTodayStudyTimeTest = async () => {
    setLoading(true);
    try {
      const result = await testGetTodayStudyTime();
      console.log("✅ 오늘 공부 시간 조회 API 성공:", result);
      setTestResults((prev: TestResults) => ({ ...prev, getTodayStudyTime: { success: true, data: result } }));
    } catch (error: unknown) {
      console.error("❌ 오늘 공부 시간 조회 API 실패:", error);
      const errorMessage = error instanceof Error ? error.message : '오늘 공부 시간 조회 테스트 중 오류가 발생했습니다.';
      setTestResults((prev: TestResults) => ({ ...prev, getTodayStudyTime: { success: false, error: errorMessage } }));
    }
    setLoading(false);
  };

  // 자동으로 기본 연결 테스트 실행
  useEffect(() => {
    handleConnectionTest();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🚀 백엔드 API 연동 상태</h1>
        <div className="mb-6">
          <p className="text-lg text-gray-600">서버 주소: <span className="font-mono bg-gray-100 px-2 py-1 rounded">https://api.live-study.com</span></p>
          <p className="text-sm text-gray-500 mt-2">
            💡 개발환경에서 백엔드 API 연동 상태를 확인합니다. CORS 설정 완료 시 정상 동작합니다.
          </p>
        </div>

        {/* 기본 인증 API 테스트 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔐 기본 인증 API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleConnectionTest}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '1️⃣ 서버 연결 확인'}
            </button>
            
            <button 
              onClick={handleLoginTest}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '2️⃣ 로그인 API 확인'}
            </button>
            
            <button 
              onClick={handleSignupTest}
              disabled={loading}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '3️⃣ 회원가입 API 확인'}
            </button>

            <button 
              onClick={handleEmailDuplicateTest}
              disabled={loading}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '📧 이메일 중복확인'}
            </button>
          </div>
        </div>

        {/* 마이페이지 API 테스트 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">👤 마이페이지 API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleNicknameTest}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '📝 닉네임 변경'}
            </button>
            
            <button 
              onClick={handleEmailTest}
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '📧 이메일 변경'}
            </button>
            
            <button 
              onClick={handlePasswordTest}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '🔒 비밀번호 변경'}
            </button>
            
            <button 
              onClick={handleProfileImageTest}
              disabled={loading}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '🖼️ 프로필 이미지'}
            </button>
          </div>
        </div>

        {/* 새로운 API 테스트 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 최신 API 테스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleProfileTest}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '👤 프로필 조회'}
            </button>
            
            <button 
              onClick={handleTitlesTest}
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '🏆 칭호 목록'}
            </button>
            
            <button 
              onClick={handleRepresentTitleTest}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '🎖️ 칭호 변경'}
            </button>
            
            <button 
              onClick={handleTodayStudyTimeTest}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '확인 중...' : '⏰ 오늘 집중'}
            </button>
          </div>
        </div>

        {/* 테스트 결과 */}
        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]: [string, TestResult]) => (
            <div key={testName} className={`p-4 rounded-lg border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className="font-bold text-lg mb-2">
                {result.success ? '✅' : '❌'} {testName} 
              </h3>
              <pre className="text-sm overflow-x-auto bg-gray-100 p-2 rounded">
                {JSON.stringify(result.success ? result.data : result.error, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}