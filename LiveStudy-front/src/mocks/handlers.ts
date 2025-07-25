import axios from 'axios';
import { rest } from 'msw';

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

    // 테스트용 계정만 로그인 허용
    if(email === 'test@example.com' && password === '1234') {
      return res(
        ctx.status(200),
        ctx.json({
          message: '로그인 성공',
          user: {
            uid: 'test-uid-1234',
            email,
            username: '테스트 유저',
            token: 'fake-jwt-token'
          }
        })
      )
    }

    return res(
      ctx.status(401),
      ctx.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.'})
    )
  }) 
]