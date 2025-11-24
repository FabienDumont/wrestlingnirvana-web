import type { H3Event } from 'h3';
import { wrapFetch } from '../../utils/wrapFetch';

type RegisterBody = {
  email: string;
  username: string;
  password: string;
};

type RegisterResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  username: string;
  role: string;
};

export default defineEventHandler(async (event: H3Event): Promise<void> => {
  const config = useRuntimeConfig();
  const body = await readBody<RegisterBody>(event);

  const payload: RegisterBody = {
    email: body.email,
    username: body.username,
    password: body.password,
  };

  await wrapFetch<RegisterResponse>(event, () =>
    $fetch<RegisterResponse>('/api/auth/register', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      body: payload,
    }),
  );

  // No return body needed → 204 by default
});
