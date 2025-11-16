// server/api/auth/me.get.ts
export default defineEventHandler(async (event) => {
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

  try {
    const me = await $fetch<{
      username: string;
      role: string;
    }>('/api/auth/me', {
      baseURL: config.apiBaseUrl,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      user: {
        username: me.username,
        role: me.role,
      },
    };
  } catch (err: any) {
    // If backend says token is invalid/expired, nuke cookies and bubble a 401
    if (err?.response?.status === 401 || err?.statusCode === 401) {
      deleteCookie(event, 'access_token');
      deleteCookie(event, 'refresh_token');

      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: { message: 'Unauthorized' },
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch current user',
      data: { message: 'Failed to fetch current user' },
    });
  }
});
