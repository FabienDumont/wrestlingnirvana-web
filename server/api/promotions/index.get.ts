// server/api/promotions/index.get.ts
import { wrapFetch } from '../../utils/wrapFetch';
import type { PromotionResponse } from '#shared/types/promotions';

export default defineEventHandler<Promise<PromotionResponse[]>>(async (event) => {
  const config = useRuntimeConfig();

  return await wrapFetch(event, () =>
    $fetch<PromotionResponse[]>('/api/promotions', {
      baseURL: config.apiBaseUrl,
      method: 'GET',
    }),
  );
});
