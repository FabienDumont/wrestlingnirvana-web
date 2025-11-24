// server/api/championships/[id].put.ts
import type { ChampionshipResponse } from '#shared/types/championships';

export default defineEventHandler<Promise<ChampionshipResponse>>(async (event) => {
  const config = useRuntimeConfig();
  const accessToken = getCookie(event, 'access_token');

  if (!accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: { message: 'Unauthorized' },
    });
  }

  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { message: 'Id is required' },
    });
  }

  const body = await readBody<{ name: string }>(event);

  try {
    const updated = await $fetch<ChampionshipResponse>(`/api/championships/${id}`, {
      baseURL: config.apiBaseUrl,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    });

    return updated;
  } catch (err: any) {
    const statusCode = err?.response?.status || err?.statusCode || 500;
    const data = err?.response?._data ?? err?.data;

    let message: string | undefined;

    if (typeof data === 'string') {
      message = data;
    } else if (data && typeof data === 'object') {
      message = data.detail || data.title || data.message;
    }

    if (statusCode === 401) {
      deleteCookie(event, 'access_token');
      deleteCookie(event, 'refresh_token');

      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        data: { message: message || 'Unauthorized' },
      });
    }

    throw createError({
      statusCode,
      statusMessage: message || 'Failed to update championship',
      data: { message: message || 'Failed to update championship' },
    });
  }
});
