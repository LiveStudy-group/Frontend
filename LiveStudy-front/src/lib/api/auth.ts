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

export async function login({ email, password } : LoginData) {
  try {
    const response = await axios.post('/api/auth/login', {
      email,
      password,
    })

    return response.data;
  } catch (error) {
    console.error('로그인 실패: ', error)
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
    console.error('회원가입 실패:', error);
    return null;
  }
}