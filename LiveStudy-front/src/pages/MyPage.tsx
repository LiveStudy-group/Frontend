import { useState, useRef, useEffect } from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { FiChevronDown } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";

export default function MyPage() {
  const { user, updateUser } = useAuthStore();
  const [titles, setTitles] = useState<{ name: string; key: string; type: string; description: string; acquiredAt: string }[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState(user?.profileImageUrl || "/img/my-page-profile-image-1.jpg");
  const [username, setUsername] = useState(user?.username || "");
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

useEffect(() => {
  const fetchTitles = async () => {
    try {
      const res = await fetch("/api/user/titles");
      const data = await res.json();
      setTitles(data.titles);

      // 현재 대표 칭호의 key를 초기값으로 세팅
      if (user?.title?.key) {
        setSelectedTitle(user.title.key);
      } else if (data.titles.length > 0) {
        setSelectedTitle(data.titles[0].key);
      }
    } catch (error) {
      console.error("칭호 목록 가져오기 실패:", error);
    }
  };
  fetchTitles();
}, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await fetch("/api/user/profile/change/profileImageUrl", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.imageUrl) {
        setProfileImage(data.imageUrl);
      }
    } catch (error) {
      console.error("이미지 업로드 실패", error);
    }
  };

  const handleUsernameSave = async () => {
    try {
      const res = await fetch("/api/user/profile/change/username", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: username,
          profileImageUrl: profileImage,
        }),
      });
      if (!res.ok) throw new Error("닉네임 업데이트 실패");

      const data = await res.json();
      if (user) {
        user.username = data.user.username;
      }

      setIsEditingUsername(false);
    } catch (err) {
      console.error("닉네임 저장 실패:", err);
    }
  };

  const handleEmailSave = async () => {
    try {
      const res = await fetch('api/user/profile/change/email', {
        method: "PATCH",
        headers: { "Content-type" : "application/json"},
        body: JSON.stringify({ email }),
      });
      if(!res.ok) throw new Error("이메일 변경 실패");
      const data = await res.json();

      if(user) user.email = data.user.email;

      setIsEditingEmail(false);
    } catch (error) {
      console.error("이메일 저장 실패:", error);
    }
  }

  const handlePasswordSave = async () => {
    try {
      const res = await fetch("/api/user/profile/change/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      if (!res.ok) throw new Error("비밀번호 변경 실패");

      setCurrentPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
    } catch (error) {
      console.error("비밀번호 저장 실패:", error);
    }
  };

  
  const handleTitleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedTitle(selected);

    try {
      const res = await fetch("/api/user/titles/represent", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titleKey: selected }),
      });

      const data = await res.json();

      if (user) {
        updateUser({ title: data.title }); // ✅ 여기서 title 업데이트
      }
    } catch (err) {
      console.error("대표 칭호 변경 실패:", err);
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
                className="w-10 h-10 bg-gray-300 rounded-full border border-gray-300 object-cover"
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                      setUsername(user?.username || "");
                      setIsEditingUsername(false);
                    }}
                    className="basic-button-gray hover:bg-gray-200"
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <p className="w-full text-caption1_M text-primary-500">{username}</p>
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

          <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-6">
            <div className="w-full sm:w-auto">
              <h3 className="min-w-[112px] text-body1_M">비밀번호</h3>
            </div>
            <div className="flex-1 flex justify-end items-center gap-4">
              {isEditingPassword ? (
                <>
                  <input
                    type="password"
                    placeholder="현재 비밀번호"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg border-gray-300 text-body1_R"
                  />
                  <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg border-gray-300 text-body1_R"
                  />
                  <button
                    onClick={handlePasswordSave}
                    className="basic-button-primary hover:bg-primary-600 text-white"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setIsEditingPassword(false);
                    }}
                    className="basic-button-gray hover:bg-gray-200"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="basic-button-gray hover:bg-gray-200 text-body1_R"
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
                {titles.map((title, idx) => (
                  <option key={idx} value={title.key}>
                    {title.name}
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