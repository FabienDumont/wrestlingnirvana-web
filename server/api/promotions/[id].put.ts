// server/api/promotions/[id].put.ts
import { withAuthAndId } from '~~/server/utils/withAuthAndId';

export default defineEventHandler<Promise<PromotionResponse>>(async (event) => {
  const body = await readBody<{ name: string }>(event);

  return withAuthAndId<PromotionResponse>(event, {
    method: 'PUT',
    url: (id) => `/api/promotions/${id}`,
    body,
  });
});
