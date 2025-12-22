// server/api/promotions/index.post.ts
import { wrapFetch } from '../../utils/wrapFetch';

export default defineEventHandler<Promise<PromotionResponse>>(async (event) => {
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
    $fetch<PromotionResponse>('/api/promotions', {
      baseURL: config.apiBaseUrl,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    }),
  );
});
