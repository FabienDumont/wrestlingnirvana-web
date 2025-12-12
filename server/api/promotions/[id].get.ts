// server/api/promotions/[id].get.ts
import { wrapFetch } from '../../utils/wrapFetch';
import type { PromotionResponse } from '#shared/types/promotions';

export default defineEventHandler<Promise<PromotionResponse>>(async (event) => {
  const config = useRuntimeConfig();
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Promotion id is required',
    });
  }

  return await wrapFetch(event, () =>
    $fetch<PromotionResponse>(`/api/promotions/${id}`, {
      baseURL: config.apiBaseUrl,
      method: 'GET',
    }),
  );
});
