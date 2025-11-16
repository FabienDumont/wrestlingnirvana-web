// server/api/auth/logout.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const refreshToken = getCookie(event, 'refresh_token');

  try {
    if (refreshToken) {
      await $fetch('/api/auth/logout', {
        baseURL: config.apiBaseUrl,
        method: 'POST',
        body: {
          refreshToken,
        },
      });
    }
  } catch {
    // Swallow backend errors for logout
  }

  deleteCookie(event, 'access_token');
  deleteCookie(event, 'refresh_token');

  return { success: true };
});
