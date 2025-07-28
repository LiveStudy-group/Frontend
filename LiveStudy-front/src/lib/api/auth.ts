import axios from "axios";

interface SignUpData {
  email: string;
  password: string;
  repassword: string;
  username: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    uid: string;
    email: string;
    username: string;
    title?: string;
    profileImageUrl?: string;
    token: string;
  }
}

export function handleAxiosError(error: unknown, defaultMessage: string) {
  if(axios.isAxiosError(error)) {
    throw new Error(error.response?.data?.message || defaultMessage)
  }
  throw new Error('알 수 없는 오류가 발생했습니다.')
}

// 로그인
export async function login({ email, password } : LoginData) {
  try {
    const response = await axios.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    })

    return response.data.user;
  } catch (error) {
    handleAxiosError(error, '로그인이 실패했습니다.')
    throw error;
  }
}

// 회원가입
export async function signUp({ email, password, repassword, username }: SignUpData) {
  try {
    const response = await axios.post('/api/auth/signup', {
      email,
      password,
      repassword,
      username
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, '회원가입이 실패했습니다.')
  }
}