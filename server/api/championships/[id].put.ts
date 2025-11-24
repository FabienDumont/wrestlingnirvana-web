// server/api/championships/[id].put.ts
import { wrapFetch } from '../../utils/wrapFetch';
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

  return await wrapFetch(event, () =>
    $fetch<ChampionshipResponse>(`/api/championships/${id}`, {
      baseURL: config.apiBaseUrl,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    }),
  );
});
