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

// 이메일 중복확인 함수 제거 (OpenAPI 문서에 없는 엔드포인트)
// OpenAPI 문서에 따르면 회원가입 시 409 에러로 중복 체크가 이루어짐

export const handlers = [
  // 이메일 중복확인 API (개발용 Mock)
  rest.post('/api/auth/check-email', async (req, res, ctx) => {
    const { email } = await req.json();

    console.log('🔍 MSW 이메일 중복확인:', email);

    // 간단한 유효성 검사
    if (!email) {
      return res(
        ctx.status(400),
        ctx.json({ message: '이메일을 입력해주세요.' })
      );
    }

    // 테스트용 이미 사용 중인 이메일 목록
    const existingEmails = ['existing@example.com', 'test@example.com'];
    
    if (existingEmails.includes(email)) {
      return res(
        ctx.status(409),
        ctx.json({ 
          isAvailable: false, 
          message: '이미 사용 중인 이메일입니다.' 
        })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ 
        isAvailable: true, 
        message: '사용 가능한 이메일입니다.' 
      })
    );
  }),

  rest.post('/api/auth/signup', async (req, res, ctx) => {
    const { email, password, nickname } = await req.json()

    // 간단한 유효성 검사
    if (!email || !password || !nickname) {
      return res(
        ctx.status(400),
        ctx.json({ message: '필수 정보를 모두 입력해주세요.' })
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
      ctx.json({ message: '회원가입이 완료되었습니다.' })
    )
  }),

  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    console.log('🔍 MSW 로그인 요청:', { email, password });

    // 모든 요청에 대해 성공 응답 (테스트용)
    console.log('✅ MSW: 모든 로그인 요청 성공');
    return res(
      ctx.status(201),
      ctx.json({
        token: 'fake-jwt-token-test'
      })
    );

  }),
  
  // 프로필 이미지(default Image)
  rest.post('/api/user/profile/change/profileImageUrl', async (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        imageUrl: `https://picsum.photos/100/100?random=${Date.now()}`,
      })
    )
  }),

  // 닉네임 변경 핸들러 (경로 수정)
  rest.patch('/api/user/profile/nickname', async (req, res, ctx) => {
    const { newNickname } = await req.json();

    if (!newNickname || newNickname.length < 2) {
      return res(
        ctx.status(400),
        ctx.json({ message: '닉네임은 2자 이상이어야 합니다.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ message: '닉네임이 성공적으로 변경되었습니다.' })
    );
  }),
  
  // 이메일 주소 변경 (경로 수정)
  rest.patch('/api/user/profile/email', async (req, res, ctx) => {
    const { newEmail } = await req.json();

    if (!newEmail || !newEmail.includes('@')) {
      return res(
        ctx.status(400),
        ctx.json({ message: '올바른 이메일 주소를 입력해주세요.' })
      );
    }

    if (newEmail === 'existing@example.com') {
      return res(
        ctx.status(409),
        ctx.json({ message: '이미 사용 중인 이메일입니다.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ message: '이메일이 성공적으로 변경되었습니다.' })
    );
  }),

  // 비밀번호 변경 (경로 수정)
  rest.patch('/api/user/profile/password', async (req, res, ctx) => {
    const { currentPassword, newPassword, confirmNewPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res(
        ctx.status(400),
        ctx.json({ message: '모든 필드를 입력해주세요.' })
      );
    }

    if (currentPassword !== '1234') {
      return res(
        ctx.status(403),
        ctx.json({ message: '현재 비밀번호가 일치하지 않습니다.' })
      );
    }

    if (newPassword !== confirmNewPassword) {
      return res(
        ctx.status(400),
        ctx.json({ message: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.' })
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

  // 프로필 이미지 변경 (경로 수정)
  rest.patch('/api/user/profile/profileImage', async (req, res, ctx) => {
    const { newProfileImage } = await req.json();

    if (!newProfileImage) {
      return res(
        ctx.status(400),
        ctx.json({ message: '프로필 이미지를 입력해주세요.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({ 
        message: '프로필 이미지가 성공적으로 변경되었습니다.',
        imageUrl: newProfileImage
      })
    );
  }),

  // 칭호 목록 조회
  rest.get('/api/user/titles', (_req, res, ctx) => {
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
  




  // ============================================
  // 새로운 API Handlers (OpenAPI 최신 문서 기준)
  // ============================================

  // 프로필 조회 API
  rest.get('/api/user/profile', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        profileImage: 'https://picsum.photos/100/100?random=1',
        nickname: '테스트유저',
        email: 'test@example.com',
        selectedTitle: 'NIGHT_OWL',
        totalStudyTime: 7200, // 2시간
        totalAttendanceDays: 15,
        continueAttendanceDays: 5
      })
    );
  }),

  // 통계 조회 API
  rest.get('/api/user/stat/normal', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 1,
        nickname: '테스트유저',
        totalStudyTime: 7200, // 2시간
        totalAwayTime: 1800, // 30분
        totalAttendanceDays: 15,
        continueAttendanceDays: 5,
        lastAttendanceDate: '2025-08-07'
      })
    );
  }),

  // 오늘 공부 시간 조회 API
  rest.get('/api/user/stat/today-study-time', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        todayStudyTime: 3600 // 1시간
      })
    );
  }),

  // 일별 집중도 추이 조회 API
  rest.get('/api/user/stat/daily-focus', (req, res, ctx) => {
    const url = new URL(req.url.toString());
    const startDate = url.searchParams.get('startDate') || '2025-08-01';
    const endDate = url.searchParams.get('endDate') || '2025-08-03';

    // startDate와 endDate를 활용한 데이터 생성 (현재는 고정값 반환)
    console.log(`집중도 조회 기간: ${startDate} ~ ${endDate}`);

    return res(
      ctx.status(200),
      ctx.json([
        {
          recordDate: '2025-08-01',
          dailyStudyTime: 3600,
          dailyAwayTime: 300,
          focusRatio: 0.92
        },
        {
          recordDate: '2025-08-02',
          dailyStudyTime: 4200,
          dailyAwayTime: 600,
          focusRatio: 0.87
        },
        {
          recordDate: '2025-08-03',
          dailyStudyTime: 3000,
          dailyAwayTime: 900,
          focusRatio: 0.77
        }
      ])
    );
  }),

  // 평균 집중률 조회 API
  rest.get('/api/user/stat/average-focus-ratio', (req, res, ctx) => {
    const url = new URL(req.url.toString());
    const startDate = url.searchParams.get('startDate') || '2025-08-01';
    const endDate = url.searchParams.get('endDate') || '2025-08-07';

    console.log(`평균 집중률 조회 기간: ${startDate} ~ ${endDate}`);

    return res(
      ctx.status(200),
      ctx.json({
        startDate,
        endDate,
        averageFocusRatio: 0.85
      })
    );
  }),

  // 칭호 목록 조회 API (새로운 형식)
  rest.get('/api/titles/:userId/list', (req, res, ctx) => {
    const { userId } = req.params;
    
    console.log(`사용자 ${userId}의 칭호 목록 조회`);
    
    return res(
      ctx.status(200),
      ctx.json([
        {
          titleId: 1,
          name: '첫 입장',
          description: '처음 방에 입장했을 때 취득',
          representative: false,
          isRepresentative: false
        },
        {
          titleId: 2,
          name: 'Focus Beginner',
          description: '하루 30분 이상 집중 1회',
          representative: false,
          isRepresentative: false
        },
        {
          titleId: 3,
          name: '야행성',
          description: '밤 10시 이후 30회 이상 접속',
          representative: true,
          isRepresentative: true
        }
      ])
    );
  }),

  // 대표 칭호 설정 API
  rest.post('/api/titles/:userId/equip', (req, res, ctx) => {
    const { userId } = req.params;
    const url = new URL(req.url.toString());
    const titleId = url.searchParams.get('titleId');

    console.log(`사용자 ${userId}가 칭호 ${titleId}를 대표 칭호로 설정`);

    if (!titleId) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'titleId가 필요합니다.' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        titleId: parseInt(titleId),
        name: '야행성',
        description: '밤 10시 이후 30회 이상 접속',
        representative: true,
        isRepresentative: true
      })
    );
  }),

  // 칭호 지급 평가 API
  rest.post('/api/titles/evaluate', async (req, res, ctx) => {
    const { userId, activity, stat } = await req.json();

    if (!userId) {
      return res(
        ctx.status(400),
        ctx.json({ message: 'userId가 필요합니다.' })
      );
    }

    // 간단한 칭호 지급 로직 시뮬레이션
    const grantedTitles = [];
    
    // 첫 입장 칭호
    if (activity?.enteredFirstRoom) {
      grantedTitles.push('첫 입장');
    }

    // 야행성 칭호
    if (activity?.lastLoginTime?.hour >= 22) {
      grantedTitles.push('야행성');
    }

    // Focus Beginner 칭호
    if (stat?.totalStudyTime >= 1800) { // 30분 이상
      grantedTitles.push('Focus Beginner');
    }

    return res(
      ctx.status(200),
      ctx.json({
        grantedTitleNames: grantedTitles
      })
    );
  }),

  // ============================================
  // 누락된 API 핸들러들 추가 (콘솔 에러 해결용)
  // ============================================

  // 모든 처리되지 않은 요청에 대한 폴백 핸들러 (조용하게 처리)
  rest.all('*', (req, res, ctx) => {
    // 콘솔 스팸을 줄이기 위해 특정 요청만 로깅
    const shouldLog = !req.url.pathname.includes('/api/user/stat/') && 
                     !req.url.pathname.includes('/api/titles/') &&
                     !req.url.pathname.includes('/api/user/profile');
    
    if (shouldLog) {
      console.log(`📝 MSW: ${req.method} ${req.url.pathname} (폴백 처리)`);
    }
    
    // 200 응답으로 조용히 처리
    return res(
      ctx.status(200),
      ctx.json({ 
        message: "Mock 응답",
        success: true,
        data: {}
      })
    );
  }),

]