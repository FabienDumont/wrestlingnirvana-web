// server/api/championships/index.post.ts
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

  const body = await readBody<{ name: string }>(event);

  return await wrapFetch(event, () =>
    $fetch<ChampionshipResponse>('/api/championships', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    }),
  );
});
