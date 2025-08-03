import { BASE_API_URL } from './baseUrl';

export const GOOGLE_AUTH_URL =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
    redirect_uri: `${BASE_API_URL}/auth/oauth2/callback/google`,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
  });

export const KAKAO_AUTH_URL =
  'https://kauth.kakao.com/oauth/authorize?' +
  new URLSearchParams({
    client_id: import.meta.env.VITE_KAKAO_CLIENT_ID!,
    redirect_uri: `${BASE_API_URL}/auth/oauth2/callback/kakao`,
    response_type: 'code',
  });

export const NAVER_AUTH_URL =
  'https://nid.naver.com/oauth2.0/authorize?' +
  new URLSearchParams({
    client_id: import.meta.env.VITE_NAVER_CLIENT_ID!,
    redirect_uri: `${BASE_API_URL}/auth/oauth2/callback/naver`,
    response_type: 'code',
    state: 'liveStudyStateToken',
  });
