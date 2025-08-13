import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import {
  getTodayStudyTime,
  getUserProfile,
  getUserStats,
  getUserTitles,
  updateEmail,
  updateNickname,
  updatePassword,
  updateProfileImage,
  updateRepresentTitle,
  uploadProfileImage
} from "../lib/api/auth";
import { useAuthStore } from "../store/authStore";
import type { UserStudyStatsResponse } from "../types/auth";
import { normalizeImageUrl } from "../utils/image";

export default function MyPage() {
  const { user } = useAuthStore();
  const [titles, setTitles] = useState<{ name: string; key: string; type: string; description: string; acquiredAt: string; icon: string; isRepresent: boolean }[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [userStats, setUserStats] = useState<UserStudyStatsResponse | null>(null);
  const [todayStudyTime, setTodayStudyTime] = useState<string>("00:00:00");
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingTodayTime, setIsLoadingTodayTime] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || "/img/my-page-profile-image-1.jpg");
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

useEffect(() => {
  const fetchUserData = async () => {
    try {
      // 프로필 정보 조회
      const profileResult = await getUserProfile();
      if (profileResult.success && profileResult.data) {
        const profile = profileResult.data;
        setProfileImage(normalizeImageUrl(profile.profileImage) || "/img/my-page-profile-image-1.jpg");
        setNickname(profile.nickname || "");
        setEmail(profile.email || "");
        setSelectedTitle(profile.selectedTitle || "");
      } else {
        console.warn("프로필 정보 조회 실패");
        // authStore에서 기본 정보 사용
        if (user) {
          setProfileImage(normalizeImageUrl(user.profileImageUrl) || "/img/my-page-profile-image-1.jpg");
          setNickname(user.nickname || "");
          setEmail(user.email || "");
        }
      }
      
      // 통계 정보 조회
      try {
        setIsLoadingStats(true);
        const statsResult = await getUserStats();
        if (statsResult.success && statsResult.data) {
          setUserStats(statsResult.data);
        } else {
          console.warn("통계 정보 조회 실패");
                  // 기본 통계 데이터 설정
        setUserStats({
          userId: 0,
          nickname: user?.nickname || '',
          totalStudyTime: 0,
          totalAwayTime: 0,
          totalAttendanceDays: 0,
          continueAttendanceDays: 0,
          lastAttendanceDate: new Date().toISOString().split('T')[0]
        });
        }
      } catch (error) {
        console.error('통계 정보 조회 에러:', error);
        setUserStats({
          userId: 0,
          nickname: user?.nickname || '',
          totalStudyTime: 0,
          totalAwayTime: 0,
          totalAttendanceDays: 0,
          continueAttendanceDays: 0,
          lastAttendanceDate: new Date().toISOString().split('T')[0]
        });
      } finally {
        setIsLoadingStats(false);
      }

      // 금일 집중시간 조회
      try {
        setIsLoadingTodayTime(true);
        const todayResult = await getTodayStudyTime();
        if (todayResult.success && todayResult.data) {
          const seconds = todayResult.data.todayStudyTime;
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          const remainingSeconds = seconds % 60;
          setTodayStudyTime(
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
          );
        } else {
          console.warn("금일 집중시간 조회 실패");
          setTodayStudyTime("00:00:00");
        }
      } catch (error) {
        console.error('금일 집중시간 조회 실패:', error);
        setTodayStudyTime("00:00:00");
      } finally {
        setIsLoadingTodayTime(false);
      }

      // 칭호 목록 조회
      const titlesResult = await getUserTitles();
      if (titlesResult.success && titlesResult.data) {
        // UserTitleResponse를 기존 Title 형식으로 변환
        const convertedTitles = titlesResult.data.map(title => ({
          name: title.name,
          key: title.titleId.toString(),
          type: "성취",
          description: title.description,
          acquiredAt: "2024-01-01",
          icon: "🏆",
          isRepresent: title.isRepresentative ?? title.representative ?? false
        }));
        setTitles(convertedTitles);
        // 대표 칭호를 기본 선택값으로 반영
        const currentRepresent = titlesResult.data.find(t => t.isRepresentative || t.representative);
        if (currentRepresent) setSelectedTitle(String(currentRepresent.titleId));
      } else {
        console.warn("칭호 목록 조회 실패");
        // 기본 칭호 데이터 설정
        setTitles([
          { name: "신입생", key: "newbie", type: "기본", description: "첫 시작", acquiredAt: "2024-01-01", icon: "🎓", isRepresent: false },
          { name: "집중왕", key: "focus_master", type: "성취", description: "집중 달인", acquiredAt: "2024-01-15", icon: "🔥", isRepresent: false }
        ]);
      }
    } catch (error) {
      console.error("사용자 데이터 조회 실패:", error);
      // 에러 시 기본 데이터 사용
      if (user) {
        setProfileImage(normalizeImageUrl(user.profileImageUrl) || "/img/my-page-profile-image-1.jpg");
        setNickname(user.nickname || "");
        setEmail(user.email || "");
      }
      setUserStats({
        userId: 0,
        nickname: user?.nickname || '',
        totalStudyTime: 0,
        totalAwayTime: 0,
        totalAttendanceDays: 0,
        continueAttendanceDays: 0,
        lastAttendanceDate: new Date().toISOString().split('T')[0]
      });
      setTitles([
        { name: "신입생", key: "newbie", type: "기본", description: "첫 시작", acquiredAt: "2024-01-01", icon: "🎓", isRepresent: false },
        { name: "집중왕", key: "focus_master", type: "성취", description: "집중 달인", acquiredAt: "2024-01-15", icon: "🔥", isRepresent: false }
      ]);
    }
  };
  
  fetchUserData();
}, []);

// 금일 집중시간 실시간 업데이트 (1분마다)
useEffect(() => {
  const updateTodayStudyTime = async () => {
    try {
      const todayResult = await getTodayStudyTime();
      if (todayResult.success && todayResult.data) {
        const seconds = todayResult.data.todayStudyTime;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        setTodayStudyTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
        );
      }
    } catch (error) {
      console.error('금일 집중시간 업데이트 실패:', error);
    }
  };

  // 1분마다 업데이트
  const interval = setInterval(updateTodayStudyTime, 60000);
  
  return () => clearInterval(interval);
}, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 새로운 파일 업로드 API 사용
      const uploadResult = await uploadProfileImage(file);
      
      if (uploadResult.success && uploadResult.imageUrl) {
        // 업로드된 이미지 URL로 프로필 이미지 업데이트
        const updateResult = await updateProfileImage(uploadResult.imageUrl);
        
          if (updateResult.success) {
          setProfileImage(normalizeImageUrl(uploadResult.imageUrl) || "/img/my-page-profile-image-1.jpg");
          alert("프로필 이미지가 성공적으로 변경되었습니다.");
        } else {
          alert(updateResult.message || "프로필 이미지 업데이트에 실패했습니다.");
        }
      } else {
        alert(uploadResult.message || "이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("이미지 업로드 실패", error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleUsernameSave = async () => {
    try {
      const result = await updateNickname(nickname);
      
      if (result.success) {
        setIsEditingUsername(false);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error("닉네임 저장 실패:", err);
      alert("닉네임 변경에 실패했습니다.");
    }
  };

    const handleEmailSave = async () => {
    try {
      const result = await updateEmail(email);
      
      if (result.success) {
        setIsEditingEmail(false);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("이메일 저장 실패:", error);
      alert("이메일 변경에 실패했습니다.");
    }
  };

  const handlePasswordSave = async () => {
    // 비밀번호 확인 검증
    if (newPassword !== confirmNewPassword) {
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    
    try {
      const result = await updatePassword(currentPassword, newPassword, confirmNewPassword);
      
      if (result.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsEditingPassword(false);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("비밀번호 저장 실패:", error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  
  const handleTitleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedTitle(selected);

    if (!selected) {
      alert("칭호를 선택해주세요.");
      return;
    }

    try {
      // string을 number로 변환하여 전달
      const titleId = parseInt(selected, 10);
      const result = await updateRepresentTitle(titleId);
      if (result.success) {
        console.log("칭호 변경 성공");
        alert(result.message);
      } else {
        alert(result.message || "칭호 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error("대표 칭호 변경 실패:", err);
      alert("대표 칭호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="w-full">
      <Header />
      <section className="max-w-[1280px] sm:min-h-[calc(100vh-156px)] m-auto p-6">
        <h1 className="text-headline3_B">마이페이지</h1>
        <div className="flex flex-col gap-6 pt-6">
          <h2 className="font-semibold">유저 정보</h2>

          <hr className="border-gray-100" />

          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M">프로필 이미지</h3>
            </div>
            <div className="flex-1 flex items-center justify-between gap-4">
              <img
                src={profileImage}
                alt="프로필 이미지"
                className="w-10 h-10 bg-gray-100 rounded-full border border-gray-300 object-cover"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="basic-button-gray hover:bg-gray-200 text-body1_R"
              >
                프로필 이미지 변경
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M">유저 닉네임</h3>
            </div>
            <div className="flex-1 flex justify-between items-center gap-4">
              {isEditingUsername ? (
                <>
                  <input
                              value={nickname}
          onChange={(e) => setNickname(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg border-gray-300 text-body1_R"
                  />
                  <button
                    onClick={handleUsernameSave}
                    className="basic-button-primary hover:bg-primary-600 text-white"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setNickname(user?.nickname || "");
                      setIsEditingUsername(false);
                    }}
                    className="basic-button-gray hover:bg-gray-200"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <p className="w-full text-caption1_M text-primary-500">{nickname}</p>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="basic-button-gray hover:bg-gray-200 text-body1_R"
                  >
                    닉네임 변경
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M ">이메일 주소</h3>
            </div>
            <div className="flex-1 flex justify-between items-center gap-4">
              {isEditingEmail ? (
                <>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg border-gray-300 text-body1_R"
                  />
                  <button
                    onClick={handleEmailSave}
                    className="basic-button-primary hover:bg-primary-600 text-white"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEmail(user?.email || "");
                      setIsEditingEmail(false);
                    }}
                    className="basic-button-gray hover:bg-gray-200"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <p className="w-full text-caption1_M text-primary-500">{email}</p>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="basic-button-gray hover:bg-gray-200 text-body1_R"
                  >
                    이메일 변경
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-start gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M">비밀번호</h3>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4">
              {isEditingPassword ? (
                <>
                  <input
                    type="password"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 border rounded-lg border-gray-300 text-body1_R"
                  />
                  <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 border rounded-lg border-gray-300 text-body1_R"
                  />
                  <input
                    type="password"
                    placeholder="새 비밀번호 확인"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 border rounded-lg border-gray-300 text-body1_R"
                  />
                  <button
                    onClick={handlePasswordSave}
                    className="basic-button-primary w-full sm:w-auto hover:bg-primary-600 text-white"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                      setIsEditingPassword(false);
                    }}
                    className="basic-button-gray w-full sm:w-auto hover:bg-gray-200"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="basic-button-gray w-full sm:w-auto hover:bg-gray-200 text-body1_R"
                >
                  비밀번호 변경
                </button>
              )}
            </div>
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
                onChange={handleTitleChange}
                className="w-full appearance-none bg-gray-100 border border-gray-300 text-body1_M px-4 py-2 rounded-md shadow-inner focus:ring-2 focus:ring-primary-400 focus:outline-none"
              >
                <option value="">대표 칭호를 선택해주세요</option>
                {titles.map((title, idx) => (
                  <option key={idx} value={title.key}>
                    {title.icon} {title.name} - {title.description}
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
            <h3 className="min-w-[112px] text-body1_M">금일 집중시간</h3>
            <button className="basic-button-gray">
              {isLoadingTodayTime ? "로딩 중..." : todayStudyTime}
            </button>
          </div>

          <div className="flex justify-between items-center gap-3 sm:gap-6">
            <h3 className="min-w-[112px] text-body1_M">누적 집중시간</h3>
            <button className="basic-button-gray">
              {isLoadingStats ? "로딩 중..." : 
                (userStats ? 
                  `${Math.floor((userStats.totalStudyTime || 0) / 3600)}시간 ${Math.floor(((userStats.totalStudyTime || 0) % 3600) / 60)}분` : 
                  "0시간 0분"
                )
              }
            </button>
          </div>
          
          <div className="flex justify-between items-center gap-3 sm:gap-6">
            <h3 className="min-w-[112px] text-body1_M">누적 출석일</h3>
            <button className="basic-button-gray">
              {isLoadingStats ? "로딩 중..." : 
                (userStats ? `${userStats.totalAttendanceDays || 0}일` : "0일")
              }
            </button>
          </div>
          
          <div className="flex justify-between items-center gap-3 sm:gap-6">
            <h3 className="min-w-[112px] text-body1_M">연속 출석일</h3>
            <button className="basic-button-gray">
              {isLoadingStats ? "로딩 중..." : 
                (userStats ? `${userStats.continueAttendanceDays || 0}일` : "0일")
              }
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}