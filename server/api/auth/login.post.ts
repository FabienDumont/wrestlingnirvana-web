// server/api/auth/login.post.ts
import type { H3Event } from 'h3';
import { wrapFetch } from '../../utils/wrapFetch';

type AuthResult = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  email: string;
  username: string;
  role: string;
};

type LoginBody = {
  emailOrUsername: string;
  password: string;
};

type LoginResponse = {
  user: {
    email: string;
    username: string;
    role: string;
  };
};

export default defineEventHandler(async (event: H3Event): Promise<LoginResponse> => {
  const config = useRuntimeConfig();
  const body = await readBody<LoginBody>(event);

  const payload: LoginBody = {
    emailOrUsername: body.emailOrUsername,
    password: body.password,
  };

  const authResult = await wrapFetch<AuthResult>(event, () =>
    $fetch<AuthResult>('/api/auth/login', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      body: payload,
    }),
  );

  const isProduction = !import.meta.dev;

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
    path: '/',
  };

  setCookie(event, 'access_token', authResult.accessToken, cookieOptions);
  setCookie(event, 'refresh_token', authResult.refreshToken, cookieOptions);

  return {
    user: {
      email: authResult.email,
      username: authResult.username,
      role: authResult.role,
    },
  };
});
