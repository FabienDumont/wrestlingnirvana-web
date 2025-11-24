// server/api/auth/me.get.ts
import type { H3Event } from 'h3';
import { wrapFetch } from '../../utils/wrapFetch';

type MeUpstream = {
  email: string;
  username: string;
  role: string;
};

type MeResponse = {
  user: {
    email: string;
    username: string;
    role: string;
  };
};

export default defineEventHandler(async (event: H3Event): Promise<MeResponse> => {
  const config = useRuntimeConfig();

  const accessToken = getCookie(event, 'access_token');

  if (!accessToken) {
    // No token, no user
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { message: 'Unauthorized' },
    });
  }

  const me = await wrapFetch<MeUpstream>(event, () =>
    $fetch<MeUpstream>('/api/auth/me', {
      baseURL: config.apiBaseUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );

  return {
    user: {
      email: me.email,
      username: me.username,
      role: me.role,
    },
  };
});
