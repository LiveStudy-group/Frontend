import axios from 'axios';
import { rest } from 'msw';

// 칭호 전체 목록
const allTitles = [
  {
    id: 0,
    key: 'no-title',
    name: '대표 칭호를 설정해주세요.',
    description: '마이페이지에서 칭호를 지정해주세요.',
    icon: '🙏',
    isRepresent: true,
  },
  {
    id: 1,
    key: 'first-login',
    name: '첫 입장',
    description: '처음 방에 입장했을 때 취득',
    icon: '🌱',
    isRepresent: false,
  },
  {
    id: 2,
    key: 'night-owl',
    name: '야행성',
    description: '밤 10시 이후 30회 이상 접속',
    icon: '🌙',
    isRepresent: false,
  },
  {
    id: 3,
    key: 'report-hunter',
    name: '청결 헌터',
    description: '신고 5회 이상 시 취득',
    icon: '🧹',
    isRepresent: false,
  },
  {
    id: 4,
    key: 'focus-beginner',
    name: 'Focus Beginner',
    description: '하루 30분 이상 집중 1회',
    icon: '🧘',
    isRepresent: false,
  },
  {
    id: 5,
    key: 'focus-runner',
    name: 'Focus Runner',
    description: '하루 1시간 이상 집중, 3일 연속',
    icon: '🏃',
    isRepresent: false,
  },
  {
    id: 6,
    key: 'focus-five',
    name: 'Focus 좀 치는데?!',
    description: '50분 이상 타이머 연속 5회 달성',
    icon: '🔥',
    isRepresent: false,
  },
  {
    id: 7,
    key: 'daily-visitor',
    name: '일일 학습러',
    description: '언제든 접속하면 취득',
    icon: '📅',
    isRepresent: false,
  },
  {
    id: 8,
    key: 'perfect-attendance-7',
    name: '개근상',
    description: '7일 연속 출석',
    icon: '🎯',
    isRepresent: false,
  },
  {
    id: 9,
    key: 'perfect-attendance-30',
    name: '습관 만드는 길',
    description: '30일 연속 출석',
    icon: '🏅',
    isRepresent: false,
  },
  {
    id: 10,
    key: 'from-nine',
    name: 'From 9 Start',
    description: '매일 오전 9시 정각에 접속, 7일 이상',
    icon: '⏰',
    isRepresent: false,
  },
  {
    id: 11,
    key: 'wide-foot',
    name: 'Wide Foot',
    description: '채팅 100회 이상',
    icon: '💬',
    isRepresent: false,
  },
  {
    id: 12,
    key: 'first-hour',
    name: '첫 걸음도 한 시간부터!',
    description: '누적 집중 1시간 이상',
    icon: '⏳',
    isRepresent: false,
  },
  {
    id: 13,
    key: 'hundred-focus',
    name: 'Hundred Focus',
    description: '누적 집중 100시간 달성',
    icon: '🏆',
    isRepresent: false,
  },
  {
    id: 14,
    key: 'ten-hour-day',
    name: 'Only Running for day',
    description: '하루 10시간 이상 집중',
    icon: '⚡️',
    isRepresent: false,
  },
  {
    id: 15,
    key: 'title-collector',
    name: '칭호 수첩',
    description: '칭호 10개 이상 획득',
    icon: '📖',
    isRepresent: false,
  },
];

export const checkDuplicateEmail = async (email: string) => {
  const res = await axios.post('/api/auth/check-email', {email});
  return res.data;
}

export const handlers = [
  rest.post('/api/auth/signup', async (req, res, ctx) => {
    const { email, password, repassword, username } = await req.json()

    // 간단한 유효성 검사 (프론트용 Mock이라 가볍게 처리)
    if (!email || !password || !repassword || !username) {
      return res(
        ctx.status(400),
        ctx.json({ message: '모든 값을 입력해주세요.' })
      )
    }

    if (password !== repassword) {
      return res(
        ctx.status(400),
        ctx.json({ message: '비밀번호가 일치하지 않습니다.' })
      )
    }

    if (email === 'existing@example.com') {
      return res(
        ctx.status(409),
        ctx.json({ message: '이미 사용 중인 이메일입니다.' })
      )
    }

    return res(
      ctx.status(201),
      ctx.json({ message: '회원가입 성공!' })
    )
  }),

  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    const currentTitle = allTitles.find((t) => t.isRepresent) ?? allTitles[0];

    // 테스트용 계정 1
    if(email === 'test1@example.com' && password === '1234') {
      return res(
        ctx.status(200),
        ctx.json({
          message: '로그인 성공',
          user: {
            uid: 'test-uid-1234',
            email,
            username: '테스트 유저',
            title: currentTitle?.key ? currentTitle : {
              id: 0,
              key: 'no-title',
              name: '현재 보유한 칭호가 없어요.',
              description: '마이페이지에서 칭호를 지정해주세요.',
              icon: '❔',
            },
            token: 'fake-jwt-token-1'
          }
        })
      );
    }

    // 테스트용 계정 2
    if(email === 'test2@example.com' && password === '1234') {
      return res(
        ctx.status(200),
        ctx.json({
          message: '로그인 성공',
          user: {
            uid: 'test-uid-5678',
            email,
            username: '서브 유저',
            title: currentTitle?.key ? currentTitle : {
              id: 0,
              key: 'no-title',
              name: '현재 보유한 칭호가 없어요.',
              description: '마이페이지에서 칭호를 지정해주세요.',
              icon: '❔',
            },
            token: 'fake-jwt-token-2'
          }
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.'})
    )
  }),
  
  // 프로필 이미지(default Image)
  rest.post('/api/user/profile/change/profileImageUrl', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        imageUrl: `https://picsum.photos/100/100?random=${Date.now()}`,
      })
    )
  }),

  // 기존 닉네임 변경 핸들러
  rest.patch('/api/user/profile/change/username', async (req, res, ctx) => {
    const { nickname, profileImageUrl } = await req.json();

    if (!nickname || nickname.length < 2) {
      return res(
        ctx.status(400),
        ctx.json({ message: '닉네임은 2자 이상이어야 합니다.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        user: {
          userId: 101,
          nickname,
          profileImageUrl,
        }
      })
    );
  }),

  // 이메일 주소 변경
  rest.patch('/api/user/profile/change/email', async (req, res, ctx) => {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return res(
        ctx.status(400),
        ctx.json({ message: '올바른 이메일 주소를 입력해주세요.' })
      );
    }

    if (email === 'existing@example.com') {
      return res(
        ctx.status(409),
        ctx.json({ message: '이미 사용 중인 이메일입니다.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        user: {
          email,
        }
      })
    );
  }),

  // 비밀번호 변경
  rest.patch('/api/user/profile/change/password', async (req, res, ctx) => {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return res(
        ctx.status(400),
        ctx.json({ message: '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.' })
      );
    }

    if (currentPassword !== '1234') {
      return res(
        ctx.status(403),
        ctx.json({ message: '현재 비밀번호가 일치하지 않습니다.' })
      );
    }

    if (newPassword.length < 4) {
      return res(
        ctx.status(400),
        ctx.json({ message: '새 비밀번호는 최소 4자 이상이어야 합니다.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ message: '비밀번호가 성공적으로 변경되었습니다.' })
    );
  }),

  // 칭호 목록 조회
  rest.get('/api/user/titles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        titles: allTitles,
      })
    );
  }),

  // 대표 칭호 설정 (선택사항)
  rest.patch('/api/user/titles/represent', async (req, res, ctx) => {
    const { titleKey } = await req.json();
    const selected = allTitles.find((t) => t.key === titleKey);
    if (selected) {
      allTitles.forEach((t) => (t.isRepresent = false));
      selected.isRepresent = true;
    }

    return res(
      ctx.status(200),
      ctx.json({
        message: `"${selected?.name}" 칭호가 대표로 설정되었습니다.`,
      })
    );
  }),

  rest.post('/api/study-room/enter', async (req, res, ctx) => {
    const { userId, roomId } = await req.json();

    if (!userId || !roomId) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'userId 또는 roomId가 누락되었습니다.' })
      );
    }

    if (userId === 'alreadyInRoomUser') {
      return res(
        ctx.status(409),
        ctx.json({ message: '이미 해당 방에 입장 중입니다.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        status: 200,
        roomId,
        message: '공개방 입장 성공',
      })
    );
  }),
]