// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<{ email: string; username: string; password: string }>(event);

  const payload = {
    email: body.email,
    username: body.username,
    password: body.password,
  };

  try {
    await $fetch<{
      accessToken: string;
      refreshToken: string;
      expiresAt: string;
      username: string;
      role: string;
    }>('/api/auth/register', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      body: payload,
    });
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
      message = 'Failed to sign up';
    }

    // Expose it both as statusMessage and data.message so client can read it
    throw createError({
      statusCode,
      statusMessage: message,
      data: { message },
    });
  }
});
