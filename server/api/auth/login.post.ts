// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<{ emailOrUsername: string; password: string }>(event);

  const payload = {
    emailOrUsername: body.emailOrUsername,
    password: body.password,
  };

  try {
    const authResult = await $fetch<{
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
      username: string;
      role: string;
    }>('/api/auth/login', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      body: payload,
    });

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
        username: authResult.username,
        role: authResult.role,
      },
    };
  } catch (err: any) {
    const statusCode = err?.statusCode || err?.response?.status || 500;
    const rawData = err?.data ?? err?.response?._data;

    let message: string | undefined;

    if (typeof rawData === 'string') {
      // e.g. "Invalid credentials."
      message = rawData;
    } else if (rawData && typeof rawData === 'object') {
      // e.g. { message: "Invalid credentials." } or ProblemDetails-like
      message = rawData.message || rawData.detail || rawData.title;
    }

    if (!message) {
      message = 'Failed to sign in';
    }

    // Expose it both as statusMessage and data.message so client can read it
    throw createError({
      statusCode,
      statusMessage: message,
      data: { message },
    });
  }
});
